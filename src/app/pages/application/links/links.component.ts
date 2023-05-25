import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LinkTree } from 'src/app/models/link-tree.model';
import { LinkService } from 'src/app/services/link/link.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
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

  public newLinkForm: UntypedFormGroup = new UntypedFormGroup({
    label: new UntypedFormControl('', Validators.required),
    url: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
      ),
    ]),
  });

  public links: LinkTree[] = [];

  public sidebarToggle = true;

  public typingTimeout: any;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: LinkService,
    private authService: AuthService,
    private alertService: AlertService,
    private translate: TranslateService,
    private analytics: AnalyticsService
  ) {}

  public ngOnInit(): void {
    if (!this.authService.userIsLoggedIn()) {
      this.router.navigateByUrl('/login');
    } else {
      this.getUser();
      this.getLinks();
      this.analytics.logScreenViewEvent('Links Page');
    }
  }

  public get routeHost(): string {
    return location.origin;
  }

  public get publicLink(): string {
    return this.routeHost + '/links/' + this.selectedLinkTree.id;
  }

  public copyPublicLink(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    this.alertService.openToast('success', 'linkCopied');
  }

  public saveAfterTyping() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      this.noteService.saveLink(this.selectedLinkTree).subscribe(
        () => {},
        (error: any) => {
          this.alertService.openToast('error', 'saveError');
        }
      );
    }, 2000);
  }

  public getUser(): void {
    const user: any = this.authService.getUser();
    this.user.name = user.name;
    this.user.email = user.email;
  }

  public getLinks(): void {
    this.noteService.getLinks().subscribe(
      (data: any) => {
        this.links = data;
        this.checkUrlForSelectedLink();
      },
      (error: any) => {
        this.alertService.openToast('error', 'getError');
      }
    );
  }

  public selectLink(note: LinkTree): void {
    this.noteService.getLink(note.id).subscribe(
      (data: any) => {
        this.selectedLinkTree = data;
        this.links[this.links.findIndex((x) => x.id === note.id)] = data;
      },
      (error: any) => {
        this.alertService.openToast('error', 'getError');
      }
    );
    this.router.navigate([], {
      queryParams: {
        note: note.id,
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
      const currentLink = this.links.find((x) => x.id === noteId);
      if (currentLink) {
        this.selectLink(currentLink);
      }
    }
  }

  public addLink(): void {
    this.selectedLinkTree.links.push(this.newLinkForm.value);
    this.noteService.saveLink(this.selectedLinkTree).subscribe(
      () => {
        this.newLinkForm.reset();
      },
      (error: any) => {
        this.alertService.openToast('error', 'saveError');
      }
    );
  }

  public saveButtonColor(): void {
    this.noteService.saveLink(this.selectedLinkTree).subscribe(
      () => {},
      (error: any) => {
        this.alertService.openToast('error', 'saveError');
      }
    );
  }

  public newLinkTree(): void {
    const newLink: LinkTree = {
      title: this.translate.instant('newLinkTitle'),
      description: this.translate.instant('newLinkDescription'),
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
    };
    this.noteService.createLink(newLink).subscribe(
      (note: LinkTree) => {
        this.selectedLinkTree = note;
        this.links.push(note);
      },
      (error: any) => {
        this.alertService.openToast('error', 'createError');
      }
    );
  }

  public deleteLink(linkIndex: number): void {
    this.alertService.openDangerConfirmDialog(
      'DeleteLink?',
      'ThisActionCannotBeReverted',
      'Yes,delete',
      () => {
        this.selectedLinkTree.links.splice(linkIndex, 1);
        this.noteService.saveLink(this.selectedLinkTree).subscribe(
          () => {},
          (error: any) => {
            this.alertService.openToast('error', 'deleteError');
          }
        );
      }
    );
  }

  public deleteLinkTree(note: LinkTree): void {
    this.alertService.openDangerConfirmDialog(
      'DeleteLinkTree?',
      'ThisActionCannotBeReverted',
      'Yes,delete',
      () => {
        this.noteService.deleteLink(this.selectedLinkTree).subscribe(
          () => {
            this.links.splice(
              this.links.findIndex((x) => x.id === note.id),
              1
            );
            if (this.selectedLinkTree.id === note.id) {
              this.resetSelectedLink();
            }
          },
          (error: any) => {
            this.alertService.openToast('error', 'deleteError');
          }
        );
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
