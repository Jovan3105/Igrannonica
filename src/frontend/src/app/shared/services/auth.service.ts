import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser!: string;
  
  /////////url swaggera/////////
  authUrl = "http://localhost:7004/api/login";
  registerUrl = "http://localhost:7004/api/register";
  confirmEmailUrl = "test.com";
  /////////url swaggera/////////
  constructor(private http: HttpClient, private router: Router) { }


  login(model: any){
    return this.http.post(this.authUrl, model).pipe(
      map((response:any) => {
        const user = response;
        if(user.result.succeeded){
          localStorage.setItem('token',user.token);
          //ubacuje token u localstorage inpectelement->application->localstorage
        }
      })
    )
  }
  register(model: any){
    let headers = new HttpHeaders({
      'confirmEmailUrl': this.confirmEmailUrl
    });
    let options = {headers: headers};   
    return this.http.post(this.registerUrl, model, options).pipe(
      map((response:any) => {
        if(response.result.succeeded){
          var forma = document.getElementById('blok');
          var uspesnaRegistracijaMessage = document.getElementById('uspesnaRegistracijaMessage')
          if(forma) {
            forma.style.display = "none";
          }
          uspesnaRegistracijaMessage!.style.display = "block";
          var hide_button = () => {
            if(uspesnaRegistracijaMessage) {
              uspesnaRegistracijaMessage.style.display = "none";
              this.router.navigateByUrl('/');
            }
          }
          setTimeout(hide_button, 4000);
        }
      })
    );

  }
  refreshToken() 
  {
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
}
