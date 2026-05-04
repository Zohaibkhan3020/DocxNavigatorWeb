import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7033/api/auth/';
  private helper = new JwtHelperService();

  constructor(private http: HttpClient) {}
  private username: any;

  setUserData(data: any) {
  this.username = data;
}

  getUsername() {
  const decoded = this.getDecodedToken();
  return decoded?.Username;
}
  login(loginobj: any) {
  return this.http.post<string>(`${this.baseUrl}login`, loginobj, {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    responseType: 'text' as 'json' 
  });
}

  // ✅ Store token
  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  //  Get token
  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
  const token = this.getToken();

  if (!token) return false;

  try {
    return !this.helper.isTokenExpired(token);
  } catch {
    return false;
  }
}
  // Logout
  logout() {
    localStorage.removeItem('token');
  }

  getDecodedToken() {
    const token = this.getToken();
    return token ? this.helper.decodeToken(token) : null;
  }
  
}