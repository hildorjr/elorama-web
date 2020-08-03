import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loading: boolean;
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  public constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    ) { }

  public ngOnInit(): void {
  }

  public login(): void {
    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe((data: any) => {
        this.loading = false;
        this.authService.setAuthToken(data.token);
        this.authService.setUser(data.user);
        this.router.navigateByUrl('/app');
      }, (error: any) => {
        this.loading = false;
        this.alertService.openToast('error', 'loginError');
      });
  }

}
