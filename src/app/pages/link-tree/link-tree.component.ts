import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LinkTree } from '../../models/link-tree.model';
import { LinkService } from '../../services/link/link.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-link-tree',
  templateUrl: './link-tree.component.html',
  styleUrls: ['./link-tree.component.scss'],
})
export class LinkTreeComponent implements OnInit {
  public linkTree: LinkTree = {
    id: null,
    title: '',
    description: '',
    buttonColor: '',
    buttonTextColor: '',
    links: [],
  };

  public constructor(
    private route: ActivatedRoute,
    private noteService: LinkService,
    private alertService: AlertService,
    private analytics: AnalyticsService
  ) {}

  public ngOnInit(): void {
    this.getLink();
    this.analytics.logScreenViewEvent(
      'Link Tree Page',
      this.route.snapshot.params.linkTreeId
    );
  }

  public getLink(): void {
    this.noteService
      .getPublicLinkTree(this.route.snapshot.params.linkTreeId)
      .subscribe(
        (data: any) => {
          this.linkTree = data;
        },
        (error: any) => {
          this.alertService.openToast('error', 'getError');
        }
      );
  }
}
