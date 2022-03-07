import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /////////url swaggera/////////
  authUrl = "http://localhost:5000/api/auth/";
  korisniciUrl = "http://localhost:5000/api/register/";
  confirmEmailUrl = "placeholder.com";
  /////////url swaggera/////////
  constructor(private http: HttpClient) { }

  register(model: any){
    let headers = new HttpHeaders({
      'confirmEmailUrl': this.confirmEmailUrl
    });
    let options = {headers: headers};

    return this.http.post(this.korisniciUrl + 'create' ,model, options);

  }
}
