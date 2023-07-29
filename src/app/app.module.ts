import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocsComponent } from './components/docs/docs.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AccountComponent } from './components/account/account.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { LayoutComponent } from './components/layout/layout.component';
import { StaffLoginComponent } from './components/staff-login/staff-login.component';
import { StaffDashboardComponent } from './components/staff-dashboard/staff-dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    DashboardComponent,
    DocsComponent,
    LoginComponent,
    SignupComponent,
    AdminLoginComponent,
    AccountComponent,
    EmployeesComponent,
    LayoutComponent,
    StaffLoginComponent,
    StaffDashboardComponent,
    ProductComponent,
    DeliveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
