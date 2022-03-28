import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { JwtService } from 'src/app/core/services/jwt.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor 
{

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(public authService: AuthService, public jwtService: JwtService) {}


  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.jwtService.getJwtToken()) {
      httpRequest = this.addToken(httpRequest, this.jwtService.getJwtToken());
    }
    return next.handle(httpRequest).pipe(
      catchError(error => {
      if (error.status === 401) {
        // refresh token logic
        return this.handle401Error(httpRequest, next);

      }else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((data: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(data.token);
          return next.handle(this.addToken(request, data.token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
    
  }
}

