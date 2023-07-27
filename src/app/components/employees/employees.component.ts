import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export class employee {
  id!: any;
  Name!: string;
  Phone!: number;
  Section!: string;
  Salary!: number;
  EID!: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  showDialog: boolean = false;
  showTextBox: boolean = false;

  Name: string = '';
  Phone: string = '';
  Section: string = '';
  Salary: string = '';
  EID: string = '';
  showError: string = '';
  searchTerm: string = '';
  lastEID: string = '';

  employee: employee = new employee()
  EmployeeList: employee[] = []

  createEmployeeForm!: FormGroup;

  isButtonDisabled: boolean = false;
  selectedUser: any | null = null;
  constructor(public router: Router, public adminService: AdminService, private http: HttpClient, private formBuilder: FormBuilder) { }

  toggleDialog(employee: any) {
    this.showDialog = !this.showDialog;
    this.selectedUser = employee;
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigateByUrl('');
  }

  ngOnInit(): void {
    this.getAll();
    this.createEmployeeForm = this.formBuilder.group({
      Name: [''],
      Phone: [''],
      Section: [''],
      Salary: [''],
      EID: [''],
      Gender: ['']
    });
  }

  onSubmit() {
    this.validation();
  }

  Create() {
    this.createEmployeeForm.value.EID = this.lastEID;
    this.adminService.postEmployeeData(this.createEmployeeForm.value).subscribe(resp => {
      console.log(resp);
      this.createEmployeeForm.reset();
      this.ngOnInit();
    })
  }

  getAll(): void {
    this.adminService.getEmployeeData().subscribe(resp => {
      this.EmployeeList = resp;
      console.log(resp)
      this.getLastEID()
    })
  }

  deleteList(id: number) {
    this.adminService.deleteEmployeeData(id).subscribe(
      result => {
        console.log(result);
        alert('Item Deleted Successfully');
      }
    );
    this.getAll();
  }

  updateData(id: number) {
    this.adminService.updateEmployeeData(id, this.createEmployeeForm).subscribe(
      result => console.log(result)
    );
  }

  editAction(employee: any) {
    this.createEmployeeForm.patchValue(employee);
    console.log(employee);
  }

  onEdit() {
    this.showTextBox = !this.showTextBox;
  }

  getLastEID() {
    if (this.EmployeeList.length > 0) {
      const lastEmployee = this.EmployeeList[this.EmployeeList.length - 1];
      const lastEID = lastEmployee.EID;
      const last3Digits = lastEID.slice(-3);
      const incrementedValue = Number(last3Digits) + 1;
      this.lastEID = "EMP" + incrementedValue.toString().padStart(3, '0');
      console.log(lastEID);
    }
  }

  searchEmployees() {
    if (this.searchTerm.trim() === '') {
      this.getAll();
    } else {
      this.adminService.getEmployeeData().subscribe((data: employee[]) => {
        this.EmployeeList = data.filter(employee =>
          Object.values(employee).some(value => String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      });
    }
  }

  existingEmployee() {
    this.http.get<employee[]>('http://localhost:3000/employee').subscribe(
      (employees: employee[]) => {
        const found = employees.find(employee => employee.EID === this.EID);
        if (found) {
          this.showError = "Existing Employee! ( 'Try Another E-id' )";
        } else {
          this.Create();
        }
      });
  }



  validation() {
    if (this.Name === "") {
      this.showError = "Please enter Name";
    } else if (this.Phone === "") {
      this.showError = "Please enter your Mobile No";
    } else if (parseInt(this.Phone) <= 0) {
      this.showError = "Invalid Mobile No";
    } else if (String(this.Phone).length !== 10) {
      this.showError = "Invalid Mobile No";
    } else if (this.Salary === "") {
      this.showError = "Please enter Salary";
    } else if (parseInt(this.Salary) <= 0) {
      this.showError = "Negative Value not valid";
    } else if (this.Section === "") {
      this.showError = "Please enter Section";
    } else if (this.Name && this.Phone && this.Salary && this.Section) {
      this.existingEmployee();
    }
  }

}
