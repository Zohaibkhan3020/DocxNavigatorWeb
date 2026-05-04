import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'https://localhost:7033/api/auth';

  constructor(private http: HttpClient) {}

  getMenu(roleId: number, userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/menu?roleId=${roleId}&userId=${userId}`);
  }

  getFiles() {
        return Promise.resolve([
            {
                key: '0',
                label: 'Documents',
                children: [
                    {
                        key: '0-0',
                        label: 'Work',
                        children: [
                            { key: '0-0-0', label: 'Expenses.doc' },
                            { key: '0-0-1', label: 'Resume.doc' }
                        ]
                    }
                ]
            },
            {
                key: '1',
                label: 'Pictures',
                children: [
                    { key: '1-0', label: 'Vacation.png' }
                ]
            }
        ]);
    }
}