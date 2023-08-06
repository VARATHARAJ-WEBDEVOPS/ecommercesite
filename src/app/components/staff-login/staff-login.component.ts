import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface User {
  Phone: string;
  EID: string;
}

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent implements OnInit {

  Phone: string = '';
  EID: string = '';

  showError: string = '';

  constructor(public router: Router, private http: HttpClient) { }

  onSubmit() {
    this.validation();
  }

  validation() {
    if (this.Phone === "" && this.EID === "") {
      this.showError = "Please enter Staff ID & Phone Number";
    } else if (this.Phone === "") {
      this.showError = "Please enter Phone No";
    } else if (this.EID === "") {
      this.showError = "Please enter Staff ID";
    } else if (this.Phone && this.EID) {
      this.performLogin();
    } else {
      this.showError = "Invalid User!";
    }
  }

  performLogin() {
    const loginData: User = { Phone: this.Phone, EID: this.EID };
    this.http.get<User[]>('https://database-cflh.onrender.com/employee').subscribe(
      (users: User[]) => {
        const foundUser = users.find(user => user.Phone === loginData.Phone && user.EID === loginData.EID);
        if (foundUser) {
          this.router.navigate(['/staffdashboard']);
          localStorage.setItem('staff', this.Phone);
        } else {
          this.showError = "Invalid User!";
        }
      }
    );
  }

  ngOnInit(): void {
    if (localStorage.getItem('staff')) {
      this.router.navigateByUrl('/staffdashboard');
    }
  }
}
