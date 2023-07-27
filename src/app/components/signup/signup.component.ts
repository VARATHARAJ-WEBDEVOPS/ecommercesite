import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface User {
  name: string
  email: string
  number: string
  password: string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  constructor(public router: Router, private http: HttpClient, private formBuilder: FormBuilder, private authService: AuthService) { }

  userName: string = '';
  email: string = '';
  number: string = '';
  password: string = '';

  registrationForm!: FormGroup;

  showError: string = '';

  ngOnInit(): void {
    
    if(localStorage.getItem('token')) {
      this.router.navigateByUrl('/dashboard');
    }  

    this.registrationForm = this.formBuilder.group({
      name: [''],
      email: [''],
      number: [''],
      password: ['']
    });
  }

  moveToLogin() {
    this.router.navigateByUrl('/login')
  }

  onSubmit(): void {
    this.validation();
  }

  performLogin() {
    this.http.get<User[]>('http://localhost:3000/user').subscribe(
      (users: User[]) => {
        const foundUser = users.find(user => user.email === this.email);
        if (foundUser) {
          this.showError = "Already a User! ( 'Try Another Email ID' )";
        } else {
          const user = this.registrationForm.value;
          this.authService.register(user).subscribe(res => {
            localStorage.setItem('token', this.email);
            this.router.navigateByUrl('/dashboard');
          });
        }
      }
    );
  }




  validation() {
    if (this.userName === "") {
      this.showError = "Please enter Name";
    } else if (this.email === "") {
      this.showError = "Please enter Email"; 
    } else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(this.email)) {
      this.showError = "Invalid Email";
    } else if (this.number === "") {
      this.showError = "Please enter your Mobile No";
    } else if (parseInt(this.number) <= 0 ) {
      this.showError = "Invalid Mobile No";
    } else if (String(this.number).length !== 10) {
      this.showError = "Invalid Mobile No";
    } else if (this.password === "") {
      this.showError = "Please enter Password";
    }else if (this.userName && this.email && this.password) {
      this.performLogin();
    }
  }

}
