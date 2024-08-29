import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private apiUrl = 'http://localhost:5000/api/auth/photos';
  private apiUrl1 = 'http://localhost:5000/api/auth/product';


  constructor(private http: HttpClient) { }

  getProducts(subCategory: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}?subCategory=${subCategory}`);
  }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching images', error);
        return of([]); // Return an empty array on error
      })
    );
  }
}
