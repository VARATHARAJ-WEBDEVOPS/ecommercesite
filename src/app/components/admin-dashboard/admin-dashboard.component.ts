import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  feedbackData: any = [];
  isLoading: boolean = true;

  constructor(public router: Router, public adminService: AdminService) { }

  ngOnInit(): void {
    if (localStorage.getItem('admin') === null) {
      this.router.navigateByUrl('/adminlogin');
    }
    this.getFeedback();
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigateByUrl('');
  }
  
  getFeedback() {
    this.adminService.getFeedbackData().subscribe( resp => {
      console.log(resp);
      this.feedbackData = resp;
      this.isLoading = false;
    });
  }
}
