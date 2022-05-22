import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from 'src/app/auth/models';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Treba srediti da vraca Observables i da se handle-uju greske

  getUsers(): Observable<any[]>
  {
    return this.http.get<any>(this.apiUrl + `/Users`).pipe(
      catchError(this.handleError)
    );
  }
  
  getUser(id:number): Observable<any>{
    return this.http.get<any>(this.apiUrl + `/Users/${id}`).pipe(
      catchError(this.handleError)
    );
  }
 
  private handleError(error: HttpErrorResponse) {

    if (error.status === 0) { // greska na klijentskoj strani
      
      //console.error('An error occurred:', error.error);
      return throwError(() => new Error('Something bad happened; please try again later.'));

    } else { //greska na serveru, bad request ili tako nesto

      //console.error(`Backend returned code ${error.status}, body was: `, error.error.data.errors[0].message);
      return throwError(() => new Error(error.error.data.errors[0].message));
    }
    
  }
}
