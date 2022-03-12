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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    const loginObserver = {
      next: (x:any) => console.log('User logged in'),
      error: (err: Error) => {
        var neuspesnaRegistracija = document.getElementById('neUspesanLogin');
        neuspesnaRegistracija!.style.display = "block";
        f.controls['username'].setValue(null);
        f.controls['password'].setValue(null);
        setTimeout(() => {
          var neuspesnaRegistracija = document.getElementById('neUspesanLogin');
          neuspesnaRegistracija!.style.display = "none";
        }, 3000);
      }
    };
    this.authService.login(f.value).subscribe(loginObserver);
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }

}
