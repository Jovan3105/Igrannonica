import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Tokens } from 'src/app/auth/models/tokens';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser!: string | null;
  private helper!: JwtHelperService

  /////////url swaggera/////////
  apiUrl = "http://localhost:7220/api";
  authUrl = "http://localhost:7220/api/auth/login";
  registerUrl = "http://localhost:7220/api/auth/register";

  confirmEmailUrl = "test.com";
  /////////url swaggera/////////
  constructor(private http: HttpClient, private router: Router) { }


  login(model: any){
    return this.http.post(this.authUrl, model).pipe(
      map((response:any) => {
        const user = response;
        if(user.success){
          this.doLoginUser(user.username,user.data.token);
          //ubacuje token u localstorage inpectelement->application->localstorage
        }
      })
    )
  }

  register(model: any){
    console.log(model);
    let headers = new HttpHeaders({
      'confirmEmailUrl': this.confirmEmailUrl
    });
    let options = {headers: headers};   
    return this.http.post(this.registerUrl, model, options).pipe(
      map((response:any) => {
        if(response.success){
          var forma = document.getElementById('blok');
          var uspesnaRegistracijaMessage = document.getElementById('uspesnaRegistracijaMessage')
          if(forma) {
            forma.style.display = "none";
          }
          uspesnaRegistracijaMessage!.style.display = "block";
          var hide_button = () => {
            if(uspesnaRegistracijaMessage) {
              const user = response;
              uspesnaRegistracijaMessage.style.display = "none";
              this.doLoginUser(user.username,user.data.token);
              this.router.navigateByUrl('/dashboard');
            }
          }
          setTimeout(hide_button, 2000);
        }
      })
    );

  }

  isLoggedIn() {
    if (this.getJwtToken()) return true;
    return false;
  }

  private doLoginUser(username: string, token : string) {
    this.loggedUser = username;
    localStorage.setItem(this.JWT_TOKEN, token);
    //this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    localStorage.removeItem(this.JWT_TOKEN);
    //this.removeTokens();
  }
  
  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  } 

  getUser(id:number):any{
    console.log("radi")
    return this.http.get<any>(this.apiUrl + `/Users/${id}`);
  }
}
