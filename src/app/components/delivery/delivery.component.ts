import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  deliveryData :any;

  constructor(public router: Router, public userService: UserService) { }

  ngOnInit(): void {
    if (localStorage.getItem('admin') === null) {
      this.router.navigateByUrl('/adminlogin');
    }
    this.getDeliveryData()
  
  }

  getDeliveryData() {
    this.userService.getEmployeeData().subscribe(resp => {
      this.deliveryData = resp;
      console.log(resp);
    });
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigateByUrl('');
  }

}
