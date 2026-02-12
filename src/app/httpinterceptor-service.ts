import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpinterceptorService implements HttpInterceptor{

  constructor(private authService : AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(this.authService.isUserLoggedin()  && req.url.indexOf('basicauth') === -1) {
      const request = req.clone({
          headers: new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization' :  `Basic ${window.btoa(this.authService.username+ ":"+this.authService.password)}`
          })
      });
      return next.handle(request);
    }
      return next.handle(req);
  }
}