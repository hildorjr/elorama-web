import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from 'src/app/models/note.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  public constructor(private http: HttpClient) { }

  public getNotes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notes`);
  }

  public getNote(noteId: id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notes/${noteId}`);
  }

  public saveNote(noteData: Note): Observable<any> {
    return this.http.put(`${environment.apiUrl}/notes/${noteData.id}`, noteData);
  }

  public deleteNote(noteData: Note): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/notes/${noteData.id}`);
  }

  public createNote(noteData: Note): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notes`, noteData);
  }
}
