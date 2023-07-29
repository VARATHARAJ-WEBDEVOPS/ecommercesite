import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { employee } from '../components/employees/employees.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/banners'; // Banner Url

  constructor(private http: HttpClient) { }

  getBanners(): Observable<any> {
    return this.http.get(`${this.apiUrl}/1`);
  }


  updateBanners(id: number, banners: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, banners);
  }


  private EmployeeUrl = 'http://localhost:3000/employee';   //employee


  postEmployeeData(data: employee): Observable<employee> {
    return this.http.post<employee>(this.EmployeeUrl, data);

  }

  getEmployeeData(): Observable<employee[]> {
    return this.http.get<employee[]>(this.EmployeeUrl)
  }

  deleteEmployeeData(id: number): Observable<employee> {
    const dltUrl = `${this.EmployeeUrl}/${id}`;
    return this.http.delete<employee>(dltUrl);
  }

  updateEmployeeData(id: number, data: any) {
    return this.http.put(`${this.EmployeeUrl}/${id}`, data)
  }

  getEmployeeByEmail(Phone: any): Observable<employee[]> {
    const url = `${this.EmployeeUrl}?Phone=${Phone}`;
    return this.http.get<employee[]>(url);
  }

}