import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /////////url swaggera/////////
  authUrl = "http://localhost:5000/api/auth/";
  korisniciUrl = "http://localhost:5000/api/korisnici/";
  confirmEmailUrl = "test.com";
  /////////url swaggera/////////
  constructor(private http: HttpClient) { }


  login(model: any){
    return this.http.post(this.authUrl + 'login',model).pipe(
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

    return this.http.post(this.korisniciUrl + 'create' ,model, options);

  }
}