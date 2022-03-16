import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    if(f.controls['email'].value <= 320){
      console.log("Predugacak email");
      return;
    }
      
    const registerObserver = {
      next: (x:any) => {
        console.log('User created');
      },
      error: (err: Error) => console.log(err)
    };
    this.authService.register({username:f.value.username,email:f.value.email,hashedPassword:f.value.password}).subscribe(registerObserver);
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
  onPasswordChange(f: NgForm) {
    if(!f.controls['password'].hasError('required') && f.controls['password'].value == f.controls['registerConfirmPassword'].value){
      console.log("password");
    }
    else f.controls['registerConfirmPassword'].setErrors({passwordMismatch:true});
  }
  @ViewChild('passwordInput') passwordInput: any;
  onPasswordConfirmChange(f: NgForm) {
    if(!f.controls['registerConfirmPassword'].hasError('required') && f.controls['registerConfirmPassword'].value == f.controls['password'].value){
      console.log("confirm password");
    }
    else{
      this.passwordInput.nativeElement.value = null;
      f.controls['registerConfirmPassword'].setErrors({passwordMismatch:true})
    } 

  }
  
  

  
   
}
