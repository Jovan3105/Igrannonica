import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-email-verif',
  templateUrl: './email-verif.component.html',
  styleUrls: ['./email-verif.component.css']
})
export class EmailVerifComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const emailVerifObserver = {
      next: (x:any) => { 
        console.log('Email is verified'); 
        this.router.navigateByUrl('/login'); 
      },
      error: (err: Error) => {
        console.log(err)

      }
    };

    const verifRequestObserver = {
      next: (params:any) => { 
        console.log('Verification link params:');
        console.log(params); 
        this.authService.verifyEmailAddress(params['params']['email'], params['params']['token']).subscribe(emailVerifObserver);
      },
      error: (err: Error) => {
        console.log(err)

      }
    };
    
    this.route.queryParamMap.subscribe(verifRequestObserver);
        
  }

}
