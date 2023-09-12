import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';

interface User {
  email: string;
  password: string;
  number?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, private http: HttpClient, public firebaseAnalytics: AngularFireAnalytics,
    public title: Title) { }

  email: string = '';
  password: string = '';
  showError: string = '';

  isLoading: boolean = false;
  rememberMe: boolean = false;

  moveToSignup() {
    this.router.navigateByUrl('/signup')
  }

  ngOnInit(): void {
    this.title.setTitle('Quick-Kart |Login');
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit() {
    this.validation();
  }

  performLogin() {
    this.isLoading = true;
    this.showError = '';
    const loginData: User = { email: this.email, password: this.password };

    this.http.get<User[]>('https://database-cflh.onrender.com/user').subscribe(
      (users: User[]) => {
        const foundUser = users.find(user => user.email === loginData.email || user.number === loginData.email && user.password === loginData.password);
        if (foundUser) {
          localStorage.setItem('token', this.email);
          this.router.navigateByUrl('/dashboard');
        } else {
          this.showError = "Invalid User!";
          this.isLoading = false;
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
    } else if (!this.rememberMe) {
      this.showError = "please Check Keep me signed in!";
    } else if (this.email && this.password) {
      this.performLogin();
    } else {
      this.showError = "Invalid User!";
    }
  }

}
