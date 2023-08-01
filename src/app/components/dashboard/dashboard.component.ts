import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  offsetX = 0;
  slideWidth = window.innerWidth;
  banners: any;
  productList: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  filteredProducts: any[] = [];
  searchTerm: string = '';

  constructor(public router: Router, public productService: ProductService, public adminService: AdminService) {
  }

  isSticky = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    // Determine when to make the element sticky
    this.isSticky = window.pageYOffset >= 100; // Change '100' to the desired offset where the sticky behavior starts
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null) {
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
    this.getAll();
    this.categorizeProducts();
    this.filterProductsByCategory();
  }

  private categorizeProducts() {
    this.categories = Array.from(new Set(this.productList.map((p) => p.catogory)));

  }

  getAll() {
    this.productService.getProducts().subscribe((products) => {
      this.productList = products;
      this.categorizeProducts();
      this.filterProductsByCategory();
    });
  }


  filterProductsByCategory() {
    this.filteredProducts =
      this.selectedCategory === 'all'
        ? this.productList
        : this.productList.filter((product) => product.catogory === this.selectedCategory);
  }

  searchProducts() {
    if (this.searchTerm.trim() === '') {
      this.getAll();
    } else {
      this.filteredProducts = this.filteredProducts.filter(product =>
        Object.values(product).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
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
