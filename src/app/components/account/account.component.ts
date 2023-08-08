import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  number: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  email!: string | null;
  userData: User[] = []; 
  isLoading: boolean = false;

  constructor(public router: Router, public userService: UserService) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null){
      this.router.navigateByUrl('/login')
    }
    this.email = localStorage.getItem('token');
    this.getUserData();
  }

  getUserData(): void {
    if (this.email !== null) {
      this.isLoading = true;
      this.userService.getUserByEmail(this.email)
        .subscribe(data => {
          this.isLoading = false;
          this.userData = data;
        });
    }
  }

}
