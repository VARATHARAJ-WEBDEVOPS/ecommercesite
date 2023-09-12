import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  deliveryData :any;
  isLoading: boolean = true;

  constructor(public router: Router, public userService: UserService,  public title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Quick-Kart | Delivery');
    if (localStorage.getItem('admin') === null) {
      this.router.navigateByUrl('/adminlogin');
    }
    this.getDeliveryData()
  
  }

  getDeliveryData() {
    this.userService.getEmployeeData().subscribe(resp => {
      this.deliveryData = resp;
      console.log(resp);
      this.isLoading = false;
    });
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigateByUrl('');
  }

}
