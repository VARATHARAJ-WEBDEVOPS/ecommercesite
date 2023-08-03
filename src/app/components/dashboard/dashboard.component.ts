import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  number: string;
  wishlist?: [];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  offsetX = 0;
  slideWidth = window.innerWidth;
  banners: any;

  openProductDiolog: boolean = false;
  openPaymentDiolog: boolean = false;

  diologData: any;
  quantity: number = 1;
  reviewMessage: any;
  grandTotal: any;
  pricePerItem: number = 0;

  doorno: string = '';
  street: string = '';
  city: string = '';
  pincode: any = '';
  showError: string = "";

  productList: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  filteredProducts: any[] = [];
  searchTerm: string = '';

  email!: string | null;
  userData: User[] = [];

  constructor(public router: Router, public userService: UserService, public productService: ProductService, public adminService: AdminService) {
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
    this.email = localStorage.getItem('token');
    this.getUserData();
    this.isWishlist();
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

  openProduct(product: any) {
    this.diologData = product;
    this.grandTotal = product.Price;
    this.pricePerItem = product.Price;
    console.log(product);
    console.log(this.diologData);
    this.openProductDiolog = true;
  }

  increaseQuantity() {
    this.quantity++;
    this.calculateGrandTotal();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.calculateGrandTotal();
    }
  }

  calculateGrandTotal() {
    this.grandTotal = this.quantity * this.pricePerItem;
  }

  removePricePerItem() {
    this.pricePerItem = 0;
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

  getUserData(): void {
    if (this.email !== null) {
      this.userService.getUserByEmail(this.email)
        .subscribe(data => {
          this.userData = data;
          console.log(this.userData);
        });
    }
  }

  isWishlist() {

  }

  toggleWishlist(id: any) {

  }

  validation () {
    if ( this.doorno === '' ) {
      this.showError = "please enter your Plat / Door No.";
    } else if ( this.street === '' ) {
      this.showError = "Please enter your Street Name";
    } else if ( this.city === '' ) {
      this.showError = "Please enter your City";
    }else if ( this.pincode === '' ) {
      this.showError = "Please enter your Pincode";
    }else if ( this.pincode !== 6 ) {
      this.showError = "Please enter Valid Pincode";
    }
  }



}

