import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productList: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  filteredProducts: any[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService, public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('admin') === null) {
      this.router.navigateByUrl('/adminlogin');
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
   this.filteredProducts = this.selectedCategory === 'all' ? this.productList : this.productList.filter((product) => product.catogory === this.selectedCategory);
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

  logout() {
    localStorage.removeItem('admin');
    this.router.navigateByUrl('');
  }


}
