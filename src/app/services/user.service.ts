// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../components/account/account.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User[]> {
    const url = `${this.apiUrl}?email=${email}`;
    return this.http.get<User[]>(url);
  }
}
