import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  isScrolled: boolean = false;

  constructor(public router: Router) { }

  @HostListener('window:scroll', [])

  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollPercentage = (scrollY / (document.body.scrollHeight - windowHeight)) * 100;
    this.isScrolled = scrollPercentage > 50;
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/dashboard');
    }
  }

}
