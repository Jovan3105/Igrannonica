import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/core/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private helper!: JwtHelperService;

  /////////url swaggera/////////
  apiUrl = environment.apiUrl;
  LoginUrl = environment.apiUrl + "/auth/login";
  registerUrl = environment.apiUrl + "/auth/register";

  confirmEmailUrl = environment.apiUrl + "/Auth/verifyEmail";
  /////////url swaggera/////////

  constructor(private http: HttpClient, private router: Router, private jwtService: JwtService) { }

  private _updatemenu = new Subject<void>();
  get updatemenu() {
    return this._updatemenu;
  }

  login(model: any){

    return this.http.post(this.LoginUrl, model).pipe(
      map((response:any) => {
        const user = response;
        if(user.success){
          this.jwtService.storeTokens(user.data); //ubacuje token u localstorage
          //window.location.reload()
        }
      })
    )
  }

  logout() {
    this.jwtService.removeTokens();
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
    if (this.jwtService.getJwtToken()) return true;
    return false;
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {
      'accessToken':this.jwtService.getJwtToken(),
      'refreshToken': this.jwtService.getRefreshToken()
    }).pipe(
      tap((data: any) => {
        this.jwtService.storeTokens(data);
    }));
  }

  verifyEmailAddress(email:string, token:string): any {
    return this.http.get<any>(this.confirmEmailUrl + `?email=${email}&token=${token}`);
  }

}
