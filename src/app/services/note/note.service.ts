import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Note } from 'src/app/models/note.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  public constructor(private http: HttpClient, private authService: AuthService) { }

  public getNotes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notes`, {
      headers: {
        authorization: `Bearer ${this.authService.getAuthToken()}`
      }
    });
  }

  public saveNote(noteData: Note): Observable<any> {
    return this.http.put(`${environment.apiUrl}/notes/${noteData.id}`, noteData, {
      headers: {
        authorization: `Bearer ${this.authService.getAuthToken()}`
      }
    });
  }

  public deleteNote(noteData: Note): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/notes/${noteData.id}`, {
      headers: {
        authorization: `Bearer ${this.authService.getAuthToken()}`
      }
    });
  }

  public createNote(noteData: Note): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notes`, noteData, {
      headers: {
        authorization: `Bearer ${this.authService.getAuthToken()}`
      }
    });
  }
}
