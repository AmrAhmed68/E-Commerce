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


  private apiUrl = 'http://localhost:5000/api/auth';

  // login(credentials : any ): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
  //     tap((response: any) => {
  //       if (response.token) {
  //         localStorage.setItem('authToken', response.token);
  //         localStorage.setItem('user', JSON.stringify(response.user));
  //         localStorage.setItem('isAdmin' , JSON.stringify(response.isAdmin))
  //       }
  //     })
  //   );
  // }

  login(credentials : any ): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('isAdmin', JSON.stringify(response.isAdmin));

          // Notify subscribers that login has occurred
          this.authStatus.next(true);
        }
      })
    );
  }


  getLogo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logo`);
  }

  uploadLogo(data: { imageUrl: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/uploads`, data , {headers});
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

  signUp(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  logout() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.authStatus.next(false);
    this.router.navigate(['/home']);
    }
  }

}






