import { Injectable, inject } from '@angular/core';
import {
  Analytics,
  logEvent,
  setUserId,
  setUserProperties,
} from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private analytics: Analytics = inject(Analytics);

  public constructor() {}

  public logScreenViewEvent(screenName: string, routeParams?: string): void {
    logEvent(this.analytics, 'screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: 'AnalyticsService',
      routeParams: routeParams,
    });
  }

  public logEvent(eventName: string): void {
    logEvent(this.analytics, eventName);
  }

  public setUserId(userId: string): void {
    setUserId(this.analytics, userId);
  }

  public setUserProperties(userProperties: any): void {
    setUserProperties(this.analytics, userProperties);
  }
}
