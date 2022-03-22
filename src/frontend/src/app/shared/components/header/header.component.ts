import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: any
  constructor(private service: AuthService) { }
  user$!:Observable<any>;

  ngOnInit(): void {
    /*
    var decodedToken = this.service.getDecodedAccessToken(this.service.getJwtToken()!)
    var id = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];
    //console.log(this.service.getUser(id))
    this.isLoggedIn = this.service.isLoggedIn()
    this.user$ = this.service.getUser(id);*/
  }

}
