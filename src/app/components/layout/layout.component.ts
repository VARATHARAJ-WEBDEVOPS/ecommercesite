import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(public router: Router, public adminService: AdminService) { }

  banners: any;
  updatedBanners: any = {};

  ngOnInit(): void {
    if (localStorage.getItem('admin') === null) {
      this.router.navigateByUrl('/adminlogin');
      // The ID of the entry you want to fetch
    }
      try {
        this.adminService.getBanners().subscribe(
          (data) => {
            this.banners = data;
            this.updatedBanners = { ...data }; // Make a copy for editing
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
    const id = 1; // The ID of the entry you want to update
    this.adminService.updateBanners(id, this.updatedBanners).subscribe(
      () => {
        console.log('Banners updated successfully!');
        // If you want to refresh the displayed banners, you can call ngOnInit() again.
        this.ngOnInit();
      }
    );
  }

}
