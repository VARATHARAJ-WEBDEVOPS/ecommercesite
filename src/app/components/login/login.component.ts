import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, private http: HttpClient) { }

  email: string = '';
  password: string = '';

  showError: string = '';

  moveToSignup() {
    this.router.navigateByUrl('/signup')
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit() {
    this.validation();
  }

  performLogin() {
    const loginData: User = { email: this.email, password: this.password };

    this.http.get<User[]>('http://localhost:3000/user').subscribe(
      (users: User[]) => {
        const foundUser = users.find(user => user.email === loginData.email && user.password === loginData.password);
        if (foundUser) {
          this.router.navigate(['/dashboard']);
          localStorage.setItem('token', this.email);
        } else {
          this.showError = "Invalid User!";
        }
      }
    );
  }

  validation() {
    if (this.email === "" && this.password === "") {
      this.showError = "Please enter Email & Password";
    } else if (this.password === "") {
      this.showError = "Please enter your Password";
    } else if (this.email === "") {
      this.showError = "Please enter your Email";
    } else if (this.email === "admin" && this.password === "admin") {
      this.router.navigateByUrl('/adminlogin');
    } else if (this.email === "staff" && this.password === "staff") {
      this.router.navigateByUrl('/stafflogin');
    }else if (this.email && this.password) {
      this.performLogin();
    } else {
      this.showError = "Invalid User!";
    }
  }

}
