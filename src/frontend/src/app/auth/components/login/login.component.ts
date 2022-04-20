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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    const loginObserver = {
      next: (x:any) => { 
        console.log('User logged in');
        this.loaderDisplay = "none"; 
        this.router.navigateByUrl('/dashboard'); 
      },
      error: (err: Error) => {
        this.loaderDisplay = "block";
        this.loginErrorDisplay = "block"
        f.controls['usernameOrEmail'].setValue(null);
        f.controls['password'].setValue(null);
        this.loaderDisplay = "none";
        setTimeout(() => {
          this.loginErrorDisplay = "none"
        }, 2000);
      }
    };
    this.authService.login(f.value).subscribe(loginObserver);
  }

}
