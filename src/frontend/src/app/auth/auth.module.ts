import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './components/register/register.component';



@NgModule({
  declarations: [
    RegisterComponent,

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule
  ],
  exports: [
    RegisterComponent
  ]
})
export class AuthModule { }
