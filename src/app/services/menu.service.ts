import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'https://localhost:7033/api/auth';
  private MenuUrl = 'https://localhost:7033/api/SecurityPermission';

  constructor(private http: HttpClient) {}

  getMenu(roleId: number, userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/menu?roleId=${roleId}&userId=${userId}`);
  }
getPermissions(objectId: number, type: string, roleId: number, userId: number) {
  return this.http.get<any>(
    `${this.MenuUrl}/object-permissions?ObjectID=${objectId}&ObjectType=${type}&RoleID=${roleId}&UserID=${userId}`
  );
}
 
}