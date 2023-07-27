import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './components/docs/docs.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AccountComponent } from './components/account/account.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { StaffsComponent } from './components/staffs/staffs.component';

const routes: Routes = [
  {path:'', component:DocsComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'admindashboard', component:AdminDashboardComponent},
  {path:'adminlogin', component:AdminLoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'login', component:LoginComponent},
  {path:'account', component:AccountComponent},
  {path:'employee', component:EmployeesComponent},
  {path:'staff', component:StaffsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
