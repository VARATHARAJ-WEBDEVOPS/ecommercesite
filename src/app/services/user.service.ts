// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../components/account/account.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://database-cflh.onrender.com/user';
  private OrderUrl = 'https://database-cflh.onrender.com/orders';
  private FeedbackUrl = 'https://database-cflh.onrender.com/feedback';

  url: any;

  constructor(private http: HttpClient) { }

  getUserByEmail(email: string): Observable<User[]> {
    if (!isNaN(Number(email.charAt(0)))) {
      this.url = `${this.apiUrl}?number=${email}`;
    } else {
      this.url = `${this.apiUrl}?email=${email}`
    }
    return this.http.get<User[]>(this.url);
  }

  postOrderData(data: any) {
    return this.http.post<any>(this.OrderUrl, data);
  }

  postFeedbackData(data: any) {
    return this.http.post<any>(this.FeedbackUrl, data);
  }

  getEmployeeData(): Observable<any> {
    return this.http.get<any>(this.OrderUrl);
  }

  getOrderdata(phone: string): Observable<any> {
    const ss = `${this.OrderUrl}?phoneNo=${phone}`;
    return this.http.get<any>(ss);
  }

  deleteOrderData(id: number): Observable<any> {
    const dltUrl = `${this.OrderUrl}/${id}`;
    return this.http.delete<any>(dltUrl);
  }
}
