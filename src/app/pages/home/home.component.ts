import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.redirectIfUserIsLoggedIn();
  }

  public redirectIfUserIsLoggedIn() {
    if (this.authService.userIsLoggedIn()) {
      this.router.navigateByUrl('/app');
    }
  }

}
