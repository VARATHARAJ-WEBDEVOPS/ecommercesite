import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService } from 'src/app/services/product.service';

export class employee {
  id!: any;
  Name!: string;
  Phone!: string;
  Section!: string;
  Gender?: string;
  Salary!: string;
  EID!: string;
}

export interface product {
  id: '',
  Name: "",
  PID: "",
  imgUrl: "",
  Price: "",
  OriginalPrice: "",
  Offer: "",
  Stock: "",
  catogory: "",
  review: [
    {
      user: "",
      message: ""
    }
  ]
}

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})

export class StaffDashboardComponent implements OnInit {

  showEditButton: boolean = false;
  selectedUser: any | null = null;

  Gender: string = "";
  Name: string = "";
  PID: string = "";
  imgUrl: string = "";
  Price: string = "";
  OriginalPrice: string = "";
  Offer: string = "";
  Stock: string = "";
  catogory: string = "";

  staffPhoneNo!: string | null;
  category!: string;
  editId?: any;


  showError: string = '';
  searchTerm: string = '';
  lastPID: string = '';

  employee: employee = new employee();
  EmployeeList: employee[] = [];
  ProductList: product[] = [];

  createProductForm!: FormGroup;
  updateEmployeeForm!: FormGroup;

  constructor(public router: Router,
    public adminService: AdminService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public productService: ProductService) { }


  ngOnInit(): void {
    if (localStorage.getItem('staff') === null) {
      this.router.navigateByUrl('');
    }
    this.staffPhoneNo = String(localStorage.getItem('staff'));
    this.getEmployeeData();
    this.createProductForm = this.formBuilder.group({
      id: [''],
      Name: [""],
      PID: [""],
      imgUrl: [""],
      Price: [""],
      OriginalPrice: [""],
      Offer: [""],
      Stock: [""],
      catogory: [""],
      review: [
        {
          id: '',
          user: "",
          message: ""
        }
      ]
    });
  }

  logout() {
    localStorage.removeItem('staff');
    this.router.navigateByUrl('');
  }

  getEmployeeData(): void {
    this.adminService.getEmployeeByEmail(this.staffPhoneNo)
      .subscribe(data => {
        console.log(data);
        this.EmployeeList = data;
        this.category = data[0].Section
        this.getProduct();
      });

  }

  getProduct(): void {
    this.productService.getProductByCatogory(this.category)
      .subscribe(data => {
        console.log(data);
        this.ProductList = data;
        this.getLastEID();
      });
  }

  onSubmit() {
    this.validation();
  }

  Create() {
    this.createProductForm.value.PID = this.lastPID;
    this.createProductForm.value.catogory = this.category;
    this.productService.postProductData(this.createProductForm.value,)
      .subscribe(resp => {
        console.log(resp);
        this.resetFormFields();
        this.ngOnInit();
      })
  }

  resetFormFields() {
    this.createProductForm.reset();
  }

  deleteList(id: any) {
    this.productService.deleteProductData(id).subscribe(
      result => {
        console.log(result);
      }
    );
  }

  updateData() {
    this.productService.updateProductData(String(this.createProductForm.value.id), this.createProductForm.value).subscribe(result =>
      console.log(result)
    );
    this.ngOnInit();
  }

  editAction(product: any) {
    this.createProductForm.patchValue(product);
    this.showEditButton = true;
  }

  getLastEID() {
    if (this.ProductList.length > 0) {
      const lastProduct = this.ProductList[this.ProductList.length - 1];
      const lastPID = lastProduct.PID;
      console.log(lastPID);
      const last3Digits = lastPID.slice(-3);
      const first3Digits = lastPID.slice(0, 3);
      const incrementedValue = Number(last3Digits) + 1;
      this.lastPID = first3Digits + incrementedValue.toString().padStart(3, '0');
      console.log(lastPID);
    }
  }

  searchEmployees() {
    if (this.searchTerm.trim() === '') {
      this.getProduct();
    } else {
      this.productService.getProductByCatogory(this.category).subscribe((data: product[]) => {
        this.ProductList = data.filter(product =>
          Object.values(product).some(value =>
            String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      });
    }
  }

  validation() {
    if (this.imgUrl === "") {
      this.showError = "Please enter imageUrl";
    } else if (this.Name === "") {
      this.showError = "Please enter your  Product Name";
    } else if (this.Price === "") {
      this.showError = "Please enter Price";
    } else if (this.OriginalPrice === "") {
      this.showError = "Please enter Actual Price";
    } else if (this.Offer === "") {
      this.showError = "Please enter offer %";
    } else if (this.Stock === "") {
      this.showError = "Please enter Stock";
    } else if (parseInt(this.Price) <= 0 || parseInt(this.OriginalPrice) <= 0 || parseInt(this.Offer) <= 0 || parseInt(this.Stock) <= 0) {
      this.showError = "Negative Values here";
    } else if (this.imgUrl && this.Name && this.Price && this.OriginalPrice && this.Offer && this.Stock) {
      this.Create();
    }
  }

}
