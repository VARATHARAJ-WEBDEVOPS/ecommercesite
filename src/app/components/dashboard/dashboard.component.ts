import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  offsetX = 0;
  slideWidth = window.innerWidth;
  banners: any;
  constructor(public router: Router, public adminService: AdminService) {
  }

   isSticky = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    // Determine when to make the element sticky
    this.isSticky = window.pageYOffset >= 100; // Change '100' to the desired offset where the sticky behavior starts
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')  === null ){
      this.router.navigateByUrl('');
      alert('un Autherized User!');
    } try {
      this.adminService.getBanners().subscribe(
        (data) => {
          this.banners = data;
        
      console.log(this.banners);
        });
    } catch (error) {
      console.log(error)
    }   
  }
  
  slideLeft() {
    this.offsetX += this.slideWidth;
    this.offsetX = Math.min(0, this.offsetX);
  }

  slideRight() {
    this.offsetX -= this.slideWidth;
    this.offsetX = Math.max(-(this.slideWidth * 2), this.offsetX);
  }

  reload() {
    window.location.reload();
  }
}
