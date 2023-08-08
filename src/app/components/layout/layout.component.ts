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
  isLoading: boolean = true;

  ngOnInit(): void {
    if (localStorage.getItem('admin') === null) {
      this.router.navigateByUrl('/adminlogin');
    }
      try {
        this.adminService.getBanners().subscribe(
          (data) => {
            this.banners = data;
            this.updatedBanners = { ...data }; 
            this.isLoading = false;
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
