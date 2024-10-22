import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  private apiUrl = 'http://localhost:5000/api/auth'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Log in the user
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  // Get logged-in user details
  getUser(): any {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  // Log out the user
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {});
  }
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return !!localStorage.getItem('authToken');
    }
      return false;
  }
}
