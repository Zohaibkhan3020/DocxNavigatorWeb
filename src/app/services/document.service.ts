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
    return this.http.get<any[]>(`${this.apiUrl}/AllDocument?CardID=${cardId}&UserID=${userId}`);
  }
  
  SearchDocuments(userId: number, CardID: number,Search : string,filters?: any) {
    return this.http.get<any[]>(`${this.apiUrl}/Search?UserID=${userId}&CardID=${CardID}&Search=${Search}`);
  }

 openDocument(docId: string, cardId: number, userId: number) {
  return this.http.get(
    `https://localhost:7033/api/Documents/OpenDocument?DocID=${docId}&CardID=${cardId}&UserID=${userId}`,
    { responseType: 'blob' }
  );
}

private selectedDocSubject = new BehaviorSubject<any>(null);
selectedDoc$ = this.selectedDocSubject.asObservable();

setSelectedDoc(doc: any) {
  this.selectedDocSubject.next(doc);
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
 private selectedNodeSource =
  new BehaviorSubject<number | null>(null);

selectedNode$ =
  this.selectedNodeSource.asObservable();

setSelectedNode(nodeId: number) {

  this.selectedNodeSource.next(nodeId);

}

  getSelectedNode(): number {
    return Number(localStorage.getItem('selectedNode'));
  }
}
