import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public loading: boolean;
  public registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    terms: new FormControl('', Validators.required),
  });

  public constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    ) { }

  public ngOnInit(): void {
  }

  public register(): void {
    this.loading = true;
    this.authService.register(this.registerForm.value)
      .subscribe((data: any) => {
        this.loading = false;
        this.authService.setAuthToken(data.token);
        this.authService.setUser(data.user);
        this.router.navigateByUrl('/app');
      }, (error: any) => {
        this.loading = false;
        this.alertService.openToast('error', 'registerError');
      });
  }

}
