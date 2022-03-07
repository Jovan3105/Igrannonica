import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    const registerObserver = {
      next: (x:any) => console.log('User created'),
      error: (err: Error) => console.log(err)
    };
    this.authService.register(f.value).subscribe(registerObserver);
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
}
