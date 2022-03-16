import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

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
      error: (err: Error) => console.log(err)
    };
    this.authService.login(f.value).subscribe(loginObserver);
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }

}
