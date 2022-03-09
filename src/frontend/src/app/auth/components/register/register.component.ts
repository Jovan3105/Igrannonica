import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  confirm_password: any;
  password: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    if(f.controls['email'].value <= 320){
      console.log("Predugacak email");
      return;
    }
      
    const registerObserver = {
      next: (x:any) => console.log('User created'),
      error: (err: Error) => console.log(err)
    };
    this.authService.register(f.value).subscribe(registerObserver);
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
 
   
}
