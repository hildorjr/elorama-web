import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login(loginData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, loginData);
  }

  public register(registerData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, registerData);
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  public setAuthToken(token: string): any {
    localStorage.setItem('authToken', token);
  }

  public getAuthToken(): string {
    return localStorage.getItem('authToken');
  }

  public userIsLoggedIn(): boolean {
    return !!localStorage.getItem('authToken') && !!localStorage.getItem('user');
  }

  public setUser(user: any): any {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): string {
    return JSON.parse(localStorage.getItem('user'));
  }
}
