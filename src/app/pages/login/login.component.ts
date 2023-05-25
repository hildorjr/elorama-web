import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loading: boolean;
  public loginForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', Validators.required),
  });

  public constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private analytics: AnalyticsService
  ) {}

  public ngOnInit(): void {
    this.redirectIfUserIsLoggedIn();
    this.analytics.logScreenViewEvent('Login Page');
  }

  public login(): void {
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      (data: any) => {
        this.loading = false;
        this.authService.setAuthToken(data.token);
        this.authService.setUser(data.user);
        this.router.navigateByUrl('/app');
      },
      (error: any) => {
        this.loading = false;
        this.alertService.openToast('error', 'loginError');
      }
    );
  }

  public redirectIfUserIsLoggedIn() {
    if (this.authService.userIsLoggedIn()) {
      this.router.navigateByUrl('/app');
    }
  }
}
