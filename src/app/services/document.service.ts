import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
 private apiUrl = 'https://localhost:7033/api/Documents';
private mode = new BehaviorSubject<'tree' | 'search'>('tree');


  constructor(private http: HttpClient) {}
private documentsSubject = new BehaviorSubject<any[]>([]);
documents$ = this.documentsSubject.asObservable();

setDocuments(data: any[]) {
  this.documentsSubject.next(data);
}
  getDocuments(userId: number, cardId: number) {
    debugger
    return this.http.get<any[]>(`${this.apiUrl}/AllDocument?CardID=${cardId}&UserID=${userId}`);
  }
  
  SearchDocuments(userId: number, RoleID: number,Search : string,filters?: any) {
    return this.http.get<any[]>(`${this.apiUrl}/Search?UserID=${userId}&RoleID=${RoleID}&Search=${Search}`);
  }

  openDocument(docId: string) {
  return this.http.get(
    `${this.apiUrl}/OpenDocument?docId=${docId}`,
    { responseType: 'blob' }
  );
}
  // ===== Breadcrumb =====
  private _breadcrumb = new BehaviorSubject<any[]>([]);
  breadcrumb$ = this._breadcrumb.asObservable();

  setBreadcrumb(items: any[]) {
    this._breadcrumb.next(items);
    localStorage.setItem('breadcrumb', JSON.stringify(items));
  }

  loadBreadcrumb() {
    const data = localStorage.getItem('breadcrumb');
    if (data) this._breadcrumb.next(JSON.parse(data));
  }
  // ===== Selected Node =====
  setSelectedNode(id: number) {
    localStorage.setItem('selectedNode', id.toString());
  }

  getSelectedNode(): number {
    return Number(localStorage.getItem('selectedNode'));
  }
}
