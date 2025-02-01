import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
    // Holds the current user data
    private currentUserSubject: BehaviorSubject<any>;

    constructor(private http: HttpClient, private router: Router) {
        // Load user from local storage or set null if none exists
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<any>(
            storedUser ? JSON.parse(storedUser) : null
        );
    }

    // Returns the current user data
    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    login(credentials: any) {
        const headers = new HttpHeaders().set('Authorization', `Basic ${credentials}`);
      
        return this.http.post<any>(
          'https://dev.supracontrol.com:8080/api/user/authenticate',
          {}, 
          { 
              headers: headers, 
              observe: 'response'  // Observe full response including headers
          }
      ).subscribe(response => {
          console.log(response);
      
          // Extract token from response headers
          let token = response.headers.get('Token');
      
          // Store token in local storage
          localStorage.removeItem('token');
          if (token) {
              localStorage.setItem('token', token);
          }
      
          // Navigate to users page
          this.router.navigate(['/users']);
      },
      err => {
          console.log(err);
      });
      }
      logout() {
        // Clear user from local storage and set currentUserSubject to null
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']); // Navigate to login page after logout
      }
}