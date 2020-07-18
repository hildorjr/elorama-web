import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Note } from '../../models/note.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteService } from '../../services/note/note.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  public deleteSwal = {
    title: 'Delete note?',
    text: 'This action cannot be reverted.',
    showCancelButton: true,
    buttonsStyling: false,
    focusCancel: true,
    customClass: {
      actions: 'buttons',
      confirmButton: 'button is-danger is-light',
      cancelButton: 'button is-light',
    },
    confirmButtonText: 'Yes, delete'
  };

  public logoutSwal = {
    title: 'Exit',
    text: 'Are you sure you want to logout and exit?',
    showCancelButton: true,
    buttonsStyling: false,
    focusCancel: true,
    customClass: {
      actions: 'buttons',
      confirmButton: 'button is-danger is-light',
      cancelButton: 'button is-light',
    },
    confirmButtonText: 'Yes, exit'
  };

  @ViewChild('titleInput') titleInputElement: ElementRef;
  @ViewChild('contentInput') contentInputElement: ElementRef;

  public user: any = {
    name: '',
    email: '',
    image: '',
  };

  public selectedNote: Note = {
    id: null,
    title: '',
    content: '',
  };

  public edit: any = {
    title: {
      toggle: false,
      newValue: '',
    },
    content: {
      toggle: false,
      newValue: '',
    },
  };

  public notes: Note[] = [];

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private authService: AuthService,
  ) { }

  public ngOnInit(): void {
    if (!this.authService.userIsLoggedIn()) {
      this.router.navigateByUrl('/login');
    } else {
      this.getUser();
      this.getNotes();
    }
  }

  public getUser(): void {
    const user: any = this.authService.getUser();
    this.user.name = user.name;
    this.user.email = user.email;
    this.user.image = `https://api.adorable.io/avatars/285/${this.user.email}`;
  }

  public getNotes(): void {
    this.noteService.getNotes().subscribe((data: any) => {
      this.notes = data;
      this.checkUrlForSelectedNote();
    });
  }

  public selectNote(note: Note): void {
    this.selectedNote = note;
    this.router.navigate([], {
      queryParams: {
        note: note.id
      },
      queryParamsHandling: 'merge',
    });
  }

  public resetSelectedNote(): void {
    this.selectedNote = {
      id: null,
      title: '',
      content: '',
    };
  }

  public deleteNote(note: Note): void {
    this.noteService.deleteNote(this.selectedNote).subscribe(() => {
      console.log('Note deleted');
      this.notes.splice(this.notes.findIndex(x => x.id === note.id), 1);
      if (this.selectedNote.id == note.id) {
        this.resetSelectedNote();
      }
    });
  }

  public checkUrlForSelectedNote(): void {
    const noteId = this.route.snapshot.queryParams.note;
    if (noteId) {
      const currentNote = this.notes.find(x => x.id === noteId);
      if (currentNote) {
        this.selectNote(currentNote);
      }
    }
  }

  public editTitle(): void {
    const t = this.edit.title;
    t.toggle = true;
    t.newValue = this.selectedNote.title;
    setTimeout(() => {
      this.titleInputElement.nativeElement.focus();
    });
  }

  public saveTitle(): void {
    const t = this.edit.title;
    t.toggle = false;
    if (t.newValue.length > 0 && this.selectedNote.title !== t.newValue) {
      this.selectedNote.title = t.newValue;
      this.noteService.saveNote(this.selectedNote).subscribe(() => {
        console.log('Title saved');
      });
    }
  }

  public editContent(): void {
    const c = this.edit.content;
    c.toggle = true;
    c.newValue = this.selectedNote.content;
    setTimeout(() => {
      this.contentInputElement.nativeElement.focus();
    });
  }

  public saveContent(event: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    if ((event?.metaKey && event?.keyCode === 13) || !event) {
      const c = this.edit.content;
      c.toggle = false;
      if (c.newValue.length > 0 && this.selectedNote.content !== c.newValue) {
        this.selectedNote.content = c.newValue;
        this.noteService.saveNote(this.selectedNote).subscribe(() => {
          console.log('Title saved');
        });
      }
    }
  }

  public newNote(): void {
    const newNote: Note = {
      title: 'Here is your new note',
      content: 'You can edit this from anywhere at anytime.'
    };
    this.noteService.createNote(newNote).subscribe((note: Note) => {
      this.selectedNote = note;
      this.notes.push(note);
    });
  }

  public logout(): void {
    this.authService.logout();
  }

}
