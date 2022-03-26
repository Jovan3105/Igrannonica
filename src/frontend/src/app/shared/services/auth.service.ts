import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { Token } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private helper!: JwtHelperService;

  private _updatemenu = new Subject<void>();
  get updatemenu() {
    return this._updatemenu;
  }

  /////////url swaggera/////////
  apiUrl = environment.apiUrl;
  LoginUrl = environment.apiUrl + "/auth/login";
  registerUrl = environment.apiUrl + "/auth/register";

  confirmEmailUrl = environment.apiUrl + "/Auth/verifyEmail";
  /////////url swaggera/////////

  constructor(private http: HttpClient, private router: Router) { }


  login(model: any){
    var circle = document.getElementById('circle')
    circle!.style.display = "block";
    return this.http.post(this.LoginUrl, model).pipe(
      map((response:any) => {
        const user = response;
        if(user.success){
          circle!.style.display = "none";
          this.doLoginUser(user.data);
          window.location.reload()
          //ubacuje token u localstorage inpectelement->application->localstorage
        }
      })
    )
  }

  logout() {
    this.doLogoutUser();
    this.router.navigateByUrl('/login');
    this.updatemenu.next();
    //kada se napravi API za logout
    /*
    return this.http.post<any>(`${this.apiUrl}/auth/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      map((response:any)=>{
        if(response.success)
        {
          this.doLogoutUser();
          this.router.navigateByUrl('/api/login');
        }
      }),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));*/
  }

  register(model: any){
    var circle = document.getElementById('circle')
    console.log(model);
    let headers = new HttpHeaders({
      'confirmEmailUrl': this.confirmEmailUrl
    });
    let options = {headers: headers};   
    circle!.style.display = "block";
    return this.http.post(this.registerUrl, model, options).pipe(
      map((response:any) => {
        if(response.success){
          
          var forma = document.getElementById('blok');
          var uspesnaRegistracijaMessage = document.getElementById('uspesnaRegistracijaMessage')
          forma!.style.display = "none";
          circle!.style.display = "block";
            
          circle!.style.display = "none";
          
          uspesnaRegistracijaMessage!.style.display = "block";
          var hide_button = () => {
            if(uspesnaRegistracijaMessage) {
              const user = response;
              uspesnaRegistracijaMessage.style.display = "none";
              //this.doLoginUser(user.username,user.data.token);
              this.router.navigateByUrl('/');
            }
            
          }
          setTimeout(hide_button, 3000);
        }
        
      })
      
    );

  }


  isLoggedIn() {
    if (this.getJwtToken()) return true;
    return false;
  }

  private doLoginUser(data : any) {
    localStorage.setItem(this.JWT_TOKEN, data.token);
    localStorage.setItem(this.REFRESH_TOKEN, data.refreshToken);
  }

  private doLogoutUser() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
  
  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {
      'accessToken':this.getJwtToken(),
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap((data: any) => {
        localStorage.setItem(this.JWT_TOKEN, data.token);
        localStorage.setItem(this.REFRESH_TOKEN, data.refreshToken);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  } 

  verifyEmailAddress(email:string, token:string): any {
    return this.http.get<any>(this.confirmEmailUrl + `?email=${email}&token=${token}`);
  }

  getUser(id:number):any{
    return this.http.get<any>(this.apiUrl + `/Users/${id}`);
  }
}
