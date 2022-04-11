import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-cancel-registration',
  templateUrl: './cancel-registration.component.html',
  styleUrls: ['./cancel-registration.component.css']
})
export class CancelRegistrationComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const cancelRegistrationObserver = {
      next: (x:any) => { 
        console.log('Account is deactivated'); 
        this.router.navigateByUrl('/register'); 
      },
      error: (err: Error) => {
        console.log(err)

      }
    };

    const verifRequestObserver = {
      next: (params:any) => { 
        console.log('Verification link params:');
        console.log(params); 
        this.authService.cancelRegistration(params['params']['email'], params['params']['token']).subscribe(cancelRegistrationObserver);
      },
      error: (err: Error) => {
        console.log(err)

      }
    };
    
    this.route.queryParamMap.subscribe(verifRequestObserver);

  }

}
