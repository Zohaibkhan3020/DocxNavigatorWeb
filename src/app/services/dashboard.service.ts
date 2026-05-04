import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 private apiUrl = 'https://localhost:7033/api/Dashboard';

  constructor(private http: HttpClient) {}

  getAssignments(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/AssignTo?userId=${userId}`);
  }
  getFavorites(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/Favorite?userId=${userId}`);
  }
  getRecent(username: string) {
    return this.http.get<any[]>(`${this.apiUrl}/Recent?username=${username}`);
  }
}
