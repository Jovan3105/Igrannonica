import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  confirm_password: any;
  password: any;
  validPassword: any;
  confirmPattern: any;
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
  setRequired() {

    if(this.validPassword) {
        return [Validators.required];
    } else {
        return [];
    }   
  }
  onConfirmPasswordChange(f: NgForm) {
    
    if(!f.controls['password'].hasError('required') && f.controls['password'].value == f.controls['registerConfirmPassword'].value){
      this.validPassword = true;
      console.log(this.validPassword)
    }

    else{
      this.validPassword = false;
      console.log(this.validPassword);
    }
    (f.controls['registerConfirmPassword']).setValidators(this.setRequired());
  }
  onPasswordChange(f: NgForm) {
    
    this.confirmPattern = "^"+f.controls['password'].value+"$";
  }
}
