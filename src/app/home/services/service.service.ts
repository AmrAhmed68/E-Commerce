import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private apiUrl = 'https://e-commerce-data-one.vercel.app/api/photos';
  private apiUrl1 = 'https://e-commerce-data-one.vercel.app/api/section';
  handleError: any;


  constructor(private http: HttpClient) { }

  getProducts(subCategory: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}/${subCategory}`)
  }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching images', error);
        return of([]);
      })
    );
  }


}
