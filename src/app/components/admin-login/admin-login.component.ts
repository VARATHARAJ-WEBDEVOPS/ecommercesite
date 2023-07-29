import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  adminId: string = '';
  password: string = '';

  showError: string = '';

  constructor(public router: Router) { }

  onSubmit() {
    this.validation();
  }

  validation() {
    if (this.adminId === "" && this.password === "") {
      this.showError = "Please enter Email & Password";
    } else if (this.password === "") {
      this.showError = "Please enter your Password";
    } else if (this.adminId === "") {
      this.showError = "Please enter your Email";
    } else if (this.adminId === "varathan2512002@gmail.com" && this.password === "sivasiva") {
      this.router.navigateByUrl('/admindashboard');
      localStorage.setItem('admin', this.adminId);
    } else {
      this.showError = "Invalid User!";
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('admin')) {
      this.router.navigateByUrl('/admindashboard');
    }
  }

}
