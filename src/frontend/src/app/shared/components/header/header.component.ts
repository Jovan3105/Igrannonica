import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: any;
  constructor(public service: AuthService) { }
  user$!:Observable<any>;

  ngOnInit(): void {

    this.isLoggedIn = this.service.isLoggedIn();

    if (this.isLoggedIn){
      var decodedToken = this.service.getDecodedAccessToken(this.service.getJwtToken()!);
      var id = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];
      //console.log(this.service.getUser(id));
    
      this.user$ = this.service.getUser(id);
    }
    
  }

  doLogout()
  {
    this.service.logout();
    this.isLoggedIn = !this.isLoggedIn;
  }

}
