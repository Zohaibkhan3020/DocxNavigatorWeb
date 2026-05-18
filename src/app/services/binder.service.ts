import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinderService {
private apiUrl = 'https://localhost:7033/api/Card';

  constructor(private http: HttpClient) {}
  createBinder(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload);
  }
}
