import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  isLoading: boolean =  true;
  isPlaceOrderLoading: boolean =  false;
  isWhishlistDiolog: boolean = false;
  openProductDiolog: boolean = false;
  openPaymentDiolog: boolean = false;

  diologData: any = {};
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

  showStockIssue!: string;

  email!: string | null;
  userData: User[] = [];

  createOrderForm!: FormGroup;
  postMessage: any;


  constructor(public router: Router,
    public userService: UserService,
    public productService: ProductService,
    public adminService: AdminService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private analytics: AngularFireAnalytics) {
  }

  isSticky = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    this.isSticky = window.pageYOffset >= 100;  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null && localStorage.getItem('Notatoken') != '1') {
      this.router.navigateByUrl('');
      alert('un Autherized User!');
    } 
    
        try {
      this.adminService.getBanners().subscribe(
        (data) => {
          this.banners = data;
          this.isLoading = false;
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


    this.createOrderForm = this.formBuilder.group({
      id: [''],
      PID: [''],
      userName: [''],
      phoneNo: [''],
      Address: [''],
      productName: [''],
      productPrice: [''],
      quantity: [''],
      grandTotal: [''],
      imgUrl:['']
    });
    localStorage.setItem('Notatoken', '2');
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
    const eventParams = { product: this.diologData.name, product_ID: this.diologData.PID };
    this.analytics.logEvent('product_card_click',  eventParams);
    this.openProductDiolog = true;
  }

  increaseQuantity() {
    if (this.diologData.Stock > this.quantity) {
      this.quantity++;
      this.calculateGrandTotal();
    } else {
      this.showStockIssue = `Currently stocks in (${this.diologData.Stock}) Only`;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.showStockIssue = "";
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

  sendReview() {
    const user = this.userData[0].name;
    const message = this.postMessage;
    const newReview = { user, message };
    this.diologData.review.push(newReview);
    this.http.put<any>(`https://database-cflh.onrender.com/products/${this.diologData.id}`, this.diologData).subscribe(res => {
      this.postMessage = '';
    });
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
          const eventParams = { page: 'UserDashboard', name: `${data[0].name}`, email: `${data[0].email}`, phoneNo: `${data[0].number}`  };
          this.analytics.logEvent('Logged users', eventParams);
          console.log(`Event 'button_click' logged with parameters:`, eventParams);
        });
    }
  }

  isWishlist() {

  }

  toggleWishlist(id: any) {

  }

  putdatatoReactiveFoem() {
    this.createOrderForm.value.userName = this.userData[0].name;
    this.createOrderForm.value.PID = this.diologData.PID;
    this.createOrderForm.value.imgUrl = this.diologData.imgUrl;
    this.createOrderForm.value.phoneNo = this.userData[0].number;
    this.createOrderForm.value.Address = `${this.doorno},${this.street},${this.city}-${this.pincode}`;
    this.createOrderForm.value.productName = this.diologData.Name;
    this.createOrderForm.value.productPrice = this.diologData.Price;
    this.createOrderForm.value.quantity = this.quantity;
    this.createOrderForm.value.grandTotal = this.grandTotal;
  }

  reduceStock() {
    this.diologData.Stock = this.diologData.Stock - this.quantity;
    this.productService.updateProductData(this.diologData.id, this.diologData).subscribe(result => {
      console.log(result);
    });
  }

  createOrder() {
    this.isPlaceOrderLoading = true;
    this.reduceStock();
    this.putdatatoReactiveFoem();
    this.userService.postOrderData(this.createOrderForm.value).subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.isPlaceOrderLoading = false;
        this.openProductDiolog = false;
        this.openPaymentDiolog = false; 
        this.quantity = 1;
        this.resetAddressForm();
      }
    })
  }

  resetAddressForm() {
    this.doorno = '';
    this.street = '';
    this.city = '';
    this.pincode = '';
    this.showError = '';
  
  }

  validation() {
    if (this.doorno === '') {
      this.showError = "please enter your Plat / Door No.";
    } else if (this.street === '') {
      this.showError = "Please enter your Street Name";
    } else if (this.city === '') {
      this.showError = "Please enter your City";
    } else if (this.pincode === '') {
      this.showError = "Please enter your Pincode";
    } else if (String(this.pincode).length != 6) {
      this.showError = "Invalid Pincode";
    } else if (this.doorno && this.street && this.city && this.pincode) {
      this.createOrder();
    }
  }

  performPaymentCancel() {
    this.quantity = 1; 
    this.openProductDiolog = false; 
    this.openPaymentDiolog = false; 
    this.showError = "";
    this.showStockIssue = "";
  }

  notyet() {
    alert('This Service is Not yet!');
  }
}

