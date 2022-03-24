import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ShowTableComponent } from '../table/show-table/show-table.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardGuard } from './guards/dashboard.guard';

const routes: Routes = [
  { path: 'api/login', component: LoginComponent, canActivate: [AuthGuard]},
  { path: 'api/register', component: RegisterComponent, canActivate:[AuthGuard]},
  { path: 'api/reset-password', component: ResetPasswordComponent},
  { path: '#', component: AppComponent},
  { path:'dashboard', component:ShowTableComponent, /*canActivate:[DashboardGuard] */}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
