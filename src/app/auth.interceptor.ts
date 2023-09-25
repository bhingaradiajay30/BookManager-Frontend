// src/app/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from './service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        const clonedRequest = token
          ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
          : req;
        return next.handle(clonedRequest);
      })
    );
  }
}
