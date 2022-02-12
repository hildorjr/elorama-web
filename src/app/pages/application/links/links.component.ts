import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LinkTree } from 'src/app/models/link-tree.model';
import { LinkService } from 'src/app/services/link/link.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  @ViewChild('titleInput') titleInputElement: ElementRef;
  @ViewChild('descriptionInput') descriptionInputElement: ElementRef;

  public user: any = {
    name: '',
    email: '',
  };

  public selectedLinkTree: LinkTree = {
    id: null,
    title: '',
    description: '',
    buttonColor: '',
    buttonTextColor: '',
    links: [],
  };

  public edit: any = {
    title: {
      toggle: false,
      newValue: '',
    },
    description: {
      toggle: false,
      newValue: '',
    },
  };

  public newLink: any = {
    label: '',
    url: '',
  };

  public links: LinkTree[] = [];

  public sidebarToggle = true;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: LinkService,
    private authService: AuthService,
    private alertService: AlertService,
    private translate: TranslateService,
  ) { }

  public ngOnInit(): void {
    if (!this.authService.userIsLoggedIn()) {
      this.router.navigateByUrl('/login');
    } else {
      this.getUser();
      this.getLinks();
    }
  }

  public get routeHost(): string {
    return location.origin;
  }

  public getUser(): void {
    const user: any = this.authService.getUser();
    this.user.name = user.name;
    this.user.email = user.email;
  }

  public getLinks(): void {
    this.noteService.getLinks().subscribe((data: any) => {
      this.links = data;
      this.checkUrlForSelectedLink();
    }, (error: any) => {
      this.alertService.openToast('error', 'getError');
    });
  }

  public selectLink(note: LinkTree): void {
    this.noteService.getLink(note.id).subscribe((data: any) => {
      this.selectedLinkTree = data;
      this.links[this.links.findIndex(x => x.id === note.id)] = data;
    }, (error: any) => {
      this.alertService.openToast('error', 'getError');
    });
    this.router.navigate([], {
      queryParams: {
        note: note.id
      },
      queryParamsHandling: 'merge',
    });
    this.toggleSidebar(false);
  }

  public resetSelectedLink(): void {
    this.selectedLinkTree = {
      id: null,
      title: '',
      description: '',
      buttonColor: '',
      buttonTextColor: '',
      links: [],
    };
  }

  public checkUrlForSelectedLink(): void {
    const noteId = this.route.snapshot.queryParams.note;
    if (noteId) {
      const currentLink = this.links.find(x => x.id === noteId);
      if (currentLink) {
        this.selectLink(currentLink);
      }
    }
  }

  public editTitle(): void {
    const t = this.edit.title;
    t.toggle = true;
    t.newValue = this.selectedLinkTree.title;
    setTimeout(() => {
      this.titleInputElement.nativeElement.focus();
    });
  }

  public saveTitle(): void {
    const t = this.edit.title;
    t.toggle = false;
    if (t.newValue.length > 0 && this.selectedLinkTree.title !== t.newValue) {
      this.selectedLinkTree.title = t.newValue;
      this.noteService.saveLink(this.selectedLinkTree).subscribe(() => {
        console.log('Title saved');
      }, (error: any) => {
        this.alertService.openToast('error', 'saveError');
      });
    }
  }

  public addLink(): void {
    this.selectedLinkTree.links.push(this.newLink);
    this.noteService.saveLink(this.selectedLinkTree).subscribe(() => {
      console.log('Button added saved');
      this.newLink = {
        label: '',
        url: '',
      };
    }, (error: any) => {
      this.alertService.openToast('error', 'saveError');
    });
  }

  public saveButtonColor(): void {
    this.noteService.saveLink(this.selectedLinkTree).subscribe(() => {
      console.log('Color saved');
    }, (error: any) => {
      this.alertService.openToast('error', 'saveError');
    });
  }

  public editDescription(): void {
    const c = this.edit.description;
    c.toggle = true;
    c.newValue = this.selectedLinkTree.description;
    setTimeout(() => {
      this.descriptionInputElement.nativeElement.focus();
    });
  }

  public saveDescription(event: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    if ((event?.metaKey && event?.keyCode === 13) || !event) {
      const c = this.edit.description;
      c.toggle = false;
      if (c.newValue.length > 0 && this.selectedLinkTree.description !== c.newValue) {
        this.selectedLinkTree.description = c.newValue;
        this.noteService.saveLink(this.selectedLinkTree).subscribe(() => {
          console.log('Title saved');
        }, (error: any) => {
          this.alertService.openToast('error', 'saveError');
        });
      }
    }
  }

  public newLinkTree(): void {
    const newLink: LinkTree = {
      title: this.translate.instant('newLinkTitle'),
      description: this.translate.instant('newLinkDescription'),
    };
    this.noteService.createLink(newLink).subscribe((note: LinkTree) => {
      this.selectedLinkTree = note;
      this.links.push(note);
    }, (error: any) => {
      this.alertService.openToast('error', 'createError');
    });
  }

  public deleteLink(linkIndex: number): void {
    this.alertService.openDangerConfirmDialog(
      'DeleteLink?',
      'ThisActionCannotBeReverted',
      'Yes,delete',
      () => {
        this.selectedLinkTree.links.splice(linkIndex, 1);
        this.noteService.saveLink(this.selectedLinkTree).subscribe(() => {
          console.log('Link deleted');
        }, (error: any) => {
          this.alertService.openToast('error', 'deleteError');
        });
      }
    );
  }

  public deleteLinkTree(note: LinkTree): void {
    this.alertService.openDangerConfirmDialog(
      'DeleteLinkTree?',
      'ThisActionCannotBeReverted',
      'Yes,delete',
      () => {
        this.noteService.deleteLink(this.selectedLinkTree).subscribe(() => {
          console.log('Link deleted');
          this.links.splice(this.links.findIndex(x => x.id === note.id), 1);
          if (this.selectedLinkTree.id === note.id) {
            this.resetSelectedLink();
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
