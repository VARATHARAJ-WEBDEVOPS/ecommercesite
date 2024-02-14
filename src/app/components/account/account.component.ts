import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';

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
  isDiolog: boolean = false;
  isWhishlistDiolog: boolean = false;
  userPhoneNumber!: string;
  OrderData: any;
  OrderGetData!: string;
  userName: any;
  picture!: string | null;
  name!: any;

  constructor(public router: Router, public userService: UserService, public title: Title) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
    this.title.setTitle('Quick-Kart | Account');
    if (localStorage.getItem('token') === null) {
      this.router.navigateByUrl('/')
    }
    this.name = JSON.parse(localStorage.getItem("name") || "");
    this.email = JSON.parse(localStorage.getItem("email") || "");
    this.picture = JSON.parse(localStorage.getItem("picture") || "");

    this.getUserData();

  }

  getUserData(): void {
    if (this.email !== null) {
      this.isLoading = true;
      this.userService.getUserByEmail(this.email)
        .subscribe(data => {
          this.isLoading = false;
          this.userData = data;
          this.getOrderdata(data[0].number);
        });
    }
  }

  getOrderdata(phone: any) {
    this.userService.getOrderdata(phone).subscribe(res => {
      console.log(res);
      this.OrderData = res;
    });
  }

  cancelOrder(id: any) {
    this.userService.deleteOrderData(id).subscribe(res => {
      this.getUserData();
      alert('Order Canceled Successfully!')
      console.log(res);
    });
  }
}
