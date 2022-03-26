import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';

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
        else if((err['error']['data']['errors']['0']['code']) == "username_AlreadyExists"){
          var registrationError = document.getElementById('usernameAlreadyExists');
          var circle = document.getElementById('circle');
          registrationError!.style.display = "block";
          circle!.style.display = "none";
          setTimeout(() => {
            registrationError!.style.display = "none";
          }, 2000);
        }
        else if((err['error']['data']['errors']['0']['code']) == "email_AlreadyExists"){
          var registrationError = document.getElementById('emailAlreadyExists');
          var circle = document.getElementById('circle');
          registrationError!.style.display = "block";
          circle!.style.display = "none";
          setTimeout(() => {
            registrationError!.style.display = "none";
          }, 2000);
        }

        
        
      }
    };
    // TODO: Naredna linija predstavlja samo trenutno resenje problema.
    // Potrebno je izbaciti registerConfirmPassword iz forme jer uzrokuje BadRequest (zato sto nije ocekivan na backend-u)
    this.authService.register({username:f.value.username,email:f.value.email,passwordHashed:f.value.password}).subscribe(registerObserver);
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
