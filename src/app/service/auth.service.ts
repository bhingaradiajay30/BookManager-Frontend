import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';  
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL = 'http://localhost:8080/api/auth';
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  login(credentials: {username: string, password: string}): Observable<string | null> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(`${this.authURL}/signin`, credentials, { headers, responseType: 'text' })
      .pipe(
        tap(token => {
          if (token) {
            this.storeToken(token);
          }
        })
      );
  }

  signup(user: {username: string, password: string}): Observable<HttpResponse<string>> {
    return this.http.post(`${this.authURL}/signup`, user, { responseType: 'text', observe: 'response' });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
  isAuthenticated(): boolean {
    return this.tokenSubject.getValue() !== null;
  }

}
