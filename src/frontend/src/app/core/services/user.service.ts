import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Treba srediti da vraca Observables i da se handle-uju greske

  getUsers()
  {
    return this.http.get<any>(this.apiUrl + `/Users`);
  }
  getUser(id:number):any{
    return this.http.get<any>(this.apiUrl + `/Users/${id}`);
  }
}
