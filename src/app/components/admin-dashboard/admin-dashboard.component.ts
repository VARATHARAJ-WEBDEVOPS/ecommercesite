import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  feedbackData: any = [];
  isLoading: boolean = true;

  constructor(public router: Router, public adminService: AdminService,  public title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Quick-Kart | AdminDashboard');
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

  navigateToGoogleAnalytics() {
    const googleAnalyticsURL = 'https://analytics.google.com/analytics/web/?authuser=1#/p401454347/reports/reportinghub?params=_u..nav%3Dmaui';
    window.location.href = googleAnalyticsURL;
  }
}
