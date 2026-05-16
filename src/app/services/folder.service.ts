import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

   private apiUrl = 'https://localhost:7033/api/Folder';

  constructor(private http: HttpClient) {}

  createVault(payload: any) {
  return this.http.post<any>(`${this.apiUrl}/FolderCreate`, payload);
}
renameNode(data: any) {
  return this.http.put<any>(`${this.apiUrl}/rename`,data
  );
}

deleteNode(data: any) {
  return this.http.put<any>(`${this.apiUrl}/delete`,data
  );
}
}
