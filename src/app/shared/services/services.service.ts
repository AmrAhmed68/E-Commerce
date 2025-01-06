import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  private apiUrl = 'https://e-commerce-data-one.vercel.app/api';

  login(credentials : any ): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log(response);
        if (response.token) {
          localStorage.setItem('id' , response.id);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('isAdmin', JSON.stringify(response.isAdmin));
          this.authStatus.next(true);
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
    return this.http.get(`${this.apiUrl}/users/:${this.getUser()._id}`);
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

  signUp(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  logout() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.clear()
    this.authStatus.next(false);
    this.router.navigate(['/home']);
    }
  }

}






