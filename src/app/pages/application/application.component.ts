import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note/note.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

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

  public sidebarToggle = true;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private authService: AuthService,
    private alertService: AlertService,
    private translate: TranslateService,
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
    }, (error: any) => {
      this.alertService.openToast('error', 'getError');
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
    this.toggleSidebar(false);
  }

  public resetSelectedNote(): void {
    this.selectedNote = {
      id: null,
      title: '',
      content: '',
    };
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
      }, (error: any) => {
        this.alertService.openToast('error', 'saveError');
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
        }, (error: any) => {
          this.alertService.openToast('error', 'saveError');
        });
      }
    }
  }

  public newNote(): void {
    const newNote: Note = {
      title: this.translate.instant('newNoteTitle'),
      content: this.translate.instant('newNoteContent'),
    };
    this.noteService.createNote(newNote).subscribe((note: Note) => {
      this.selectedNote = note;
      this.notes.push(note);
    }, (error: any) => {
      this.alertService.openToast('error', 'createError');
    });
  }

  public deleteNote(note: Note): void {
    this.alertService.openDangerConfirmDialog(
      'DeleteNote?',
      'ThisActionCannotBeReverted',
      'Yes,delete',
      () => {
        this.noteService.deleteNote(this.selectedNote).subscribe(() => {
          console.log('Note deleted');
          this.notes.splice(this.notes.findIndex(x => x.id === note.id), 1);
          if (this.selectedNote.id === note.id) {
            this.resetSelectedNote();
          }
        }, (error: any) => {
          this.alertService.openToast('error', 'deleteError');
        });
      }
    );
  }

  public logout(): void {
    this.alertService.openDangerConfirmDialog(
      'Exit',
      'AreYouSureYouWantToLogoutAndExit?',
      'Yes,exit',
      () => {
        this.authService.logout();
      }
    );
  }

  public toggleSidebar(bool?: boolean): void {
    if (bool) {
      this.sidebarToggle = bool;
    } else {
      this.sidebarToggle = !this.sidebarToggle;
    }
  }

}
