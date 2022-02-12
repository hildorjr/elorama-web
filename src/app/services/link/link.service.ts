import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LinkTree } from 'src/app/models/link-tree.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  public constructor(private http: HttpClient) { }

  public getLinks(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/linkTrees`);
  }

  public getLink(linkId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/linkTrees/${linkId}`);
  }

  public saveLink(linkData: LinkTree): Observable<any> {
    return this.http.put(`${environment.apiUrl}/linkTrees/${linkData.id}`, linkData);
  }

  public deleteLink(linkData: LinkTree): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/linkTrees/${linkData.id}`);
  }

  public createLink(linkData: LinkTree): Observable<any> {
    return this.http.post(`${environment.apiUrl}/linkTrees`, linkData);
  }
}
