import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import { Tuple } from 'ag-grid-community/dist/lib/filter/provided/simpleFilter';

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
      error: (err: any) => {
        //userOrEmail_AlreadyExists
        if(err['error'] instanceof ProgressEvent ){
          var registrationError = document.getElementById('serverError');
          var circle = document.getElementById('circle');
          registrationError!.style.display = "block";
          f.controls['username'].setValue(null)
          f.controls['email'].setValue(null)
          f.controls['password'].setValue(null)
          f.controls['registerConfirmPassword'].setValue(null)
          circle!.style.display = "none";
          setTimeout(() => {
            registrationError!.style.display = "none";
          }, 2000);
        }
        else{
          err['error']['data']['errors'].forEach(function (item:any) {
            if(item['code'] == "username_AlreadyExists"){
              var usernameError = document.getElementById('usernameAlreadyExists');
              var circle = document.getElementById('circle');
              usernameError!.style.display = "block";
              circle!.style.display = "none";
              setTimeout(() => {
                usernameError!.style.display = "none";
              }, 2000);
            }
            if(item['code'] == "email_AlreadyExists"){
              var emailError = document.getElementById('emailAlreadyExists');
              var circle = document.getElementById('circle');
              emailError!.style.display = "block";
              circle!.style.display = "none";
              setTimeout(() => {
                emailError!.style.display = "none";
              }, 2000);
            }
          });
        }
       
      }
    };
    f.form.removeControl('registerConfirmPassword'); // izbacivanje registerConfirmPassword iz objekta forme
    this.authService.register(f.value).subscribe(registerObserver);
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
