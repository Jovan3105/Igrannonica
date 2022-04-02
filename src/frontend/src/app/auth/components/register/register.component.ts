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

  loaderDisplay:string = "none";
  serverErrorDisplay:string = "none";
  registerSuccessDisplay:string = "none";
  usernameExistsDisplay:string = "none";
  emailExistsDisplay:string = "none";

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
          this.serverErrorDisplay = "block";
          f.controls['username'].setValue(null)
          f.controls['email'].setValue(null)
          f.controls['password'].setValue(null)
          f.controls['registerConfirmPassword'].setValue(null)
          this.loaderDisplay = "none";
          setTimeout(() => {
            this.serverErrorDisplay = "none";
          }, 2000);
        }
        else{
          err['error']['data']['errors'].forEach( (item:any) => {
            if(item['code'] == "username_AlreadyExists"){
              this.usernameExistsDisplay = "block";
              this.loaderDisplay = "none";
              setTimeout(() => {
                this.usernameExistsDisplay = "none";
              }, 2000);
            }
            if(item['code'] == "email_AlreadyExists"){
              this.emailExistsDisplay = "block";
              this.loaderDisplay = "none";
              setTimeout(() => {
                this.emailExistsDisplay = "none";
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
