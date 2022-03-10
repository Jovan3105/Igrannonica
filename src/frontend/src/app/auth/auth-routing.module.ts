import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ShowTableComponent } from '../table/show-table/show-table.component';

const routes: Routes = [
  { path: 'api/login', component: LoginComponent},
  { path: 'api/register', component: RegisterComponent},
  { path: 'api/reset-password', component: ResetPasswordComponent},
  { path: '#', component: AppComponent},
  { path:'dashboard', component:ShowTableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
