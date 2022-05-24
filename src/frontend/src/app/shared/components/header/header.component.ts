import { Component, DoCheck, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models';
import { AuthService } from 'src/app/auth/services/auth.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  user:User | undefined;
  user$:Observable<User> | undefined;
  displayLoginElement = false;

  constructor(public service: AuthService, public jwtService : JwtService, public userService: UserService) {}

  ngOnInit(): void {
    this.user$ = new Observable<User>();
    this.service.updatemenu.subscribe(res => {
      this.MenuDisplay();
    });

    this.MenuDisplay();
    
  }

  MenuDisplay() {
    if (this.service.isLoggedIn()) {
        this.displayLoginElement = false;
        var decodedToken = this.jwtService.getDecodedAccessToken();
        var id = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];

      this.user$ = this.userService.getUser(id);
      //ISPITATI DA LI SUBSCRIBE TREBA OVDE DA IDE
      this.user$.subscribe({
        error(msg) {
          if (msg == "authorization_problem")
          {
            console.log("Session expired! Log in again")
          }
        }
      });

      /*
      .subscribe({
        next: (response:any) => 
        {
          this.user = response;
        }
      }
      
     );*/
    }
    else this.displayLoginElement = true;
  }

  doLogout()
  {
    this.service.logout();
  }

}
