import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient , private router : Router) {}

  private apiUrl = 'http://localhost:5000/api/auth';


  login(credentials : any ): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authStatus.next(true);
          isAdmin: response.isAdmin
          localStorage.setItem('isAdmin' , response.isAdmin)
        }
      })
    );
  }

  getUser(): any {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  getUserData(): any {
    return this.http.get(`${this.apiUrl}/users`)
  }
  updateUser(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateProfile`, profileData);
  }

  getUserById(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return !!localStorage.getItem('authToken');
    }
      return false;
  }

  logout() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.authStatus.next(false);
    this.router.navigate(['/home']);
    }
  }
  signUp(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

}






