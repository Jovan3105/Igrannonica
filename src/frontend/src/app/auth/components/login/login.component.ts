import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loaderDisplay:string = "none";
  loginErrorDisplay:string = "none";
  loginSuccessDisplay:string = "none";
  errorDisplay:string = "none";
  errorMsg:string = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    this.loaderDisplay = "block"; 
    const loginObserver = {
      next: (x:any) => { 
        console.log('User logged in');
        this.loaderDisplay = "none"; 
        this.router.navigateByUrl('/training'); 
      },
      error: (err: any) => {
        
        if(err['error'] instanceof ProgressEvent ){
          //f.controls['usernameOrEmail'].setValue(null);
          //f.controls['password'].setValue(null);
          this.errorMsg = "Something went wrong. Try again later."
      
        }
        else{

          err['error']['data']['errors'].forEach( (item:any) => {
            if(item['code'] == "incorrect_password"){
              this.errorMsg = "Incorrect password";
            }
            if(item['code'] == "user_notFound"){
              this.errorMsg = "Incorrect username";
            }
            if (item['code'] == "email_notVerified")
            {
              this.errorMsg = "Email not verified";
            }
          });
        }
        this.errorDisplay = "block";
        this.loaderDisplay = "none";
        setTimeout(() => {
          this.errorDisplay = "none";
        }, 3500);
     }
    }
  this.authService.login(f.value).subscribe(loginObserver);
  }
}
