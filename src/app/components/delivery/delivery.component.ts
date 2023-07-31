import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  constructor(public router: Router, public adminService: AdminService) { }

  banners: any;
  updatedBanners: any = {};

  ngOnInit(): void {
    if (localStorage.getItem('admin') === null) {
      this.router.navigateByUrl('/adminlogin');
    }
    try {
      this.adminService.getBanners().subscribe(
        (data) => {
          this.banners = data;
          this.updatedBanners = { ...data };
          console.log(this.banners);
        });
    } catch (error) {
      console.log(error)
    }
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigateByUrl('');
  }

  updateBanners(): void {
    const id = 1;
    this.adminService.updateBanners(id, this.updatedBanners).subscribe(
      () => {
        console.log('Banners updated successfully!');
        this.ngOnInit();
      }
    );
  }

}
