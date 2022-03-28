import { Component, DoCheck, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public service: AuthService, public jwtService : JwtService, public userService: UserService) { }

  user$!:Observable<any>;
  displayLoginElement = false;

  ngOnInit(): void {

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
        //console.log(this.service.getUser(id));
    
      this.user$ = this.userService.getUser(id);
    }
    else this.displayLoginElement = true;
  }

  doLogout()
  {
    this.service.logout();
  }

}
