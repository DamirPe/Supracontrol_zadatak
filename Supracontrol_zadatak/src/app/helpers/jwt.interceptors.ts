import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token'); 
    const isApiUrl = request.url.startsWith("https://dev.supracontrol.com:8080/api");
    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Token: token,
        },
      });
    }

    return next.handle(request);
  }
}