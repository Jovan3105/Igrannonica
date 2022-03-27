import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    const loginObserver = {
      next: (x:any) => { 
        console.log('User logged in'); 
        this.router.navigateByUrl('/dashboard'); 
      },
      error: (err: Error) => {
        var loginError = document.getElementById('neUspesanLogin');
        var circle = document.getElementById('circle');
        loginError!.style.display = "block";
        f.controls['usernameOrPassword'].setValue(null)
        f.controls['password'].setValue(null)
        circle!.style.display = "none";
        setTimeout(() => {
          loginError!.style.display = "none";
        }, 2000);
      }
    };
    this.authService.login(f.value).subscribe(loginObserver);
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }

}
