import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private cartItems = new BehaviorSubject<any[]>([]); // Holds the cart items
  cartItems$ = this.cartItems.asObservable(); // Observable for components to subscribe

  private apiUrl = 'https://e-commerce-data-one.vercel.app/api/products';
  private baseUrl = 'https://e-commerce-data-one.vercel.app/api';

  constructor(private http: HttpClient) { }

  // Fetch products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Fetch product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Add product to cart
  addToCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${userId}/cart`, { productId, quantity }).pipe(
      tap(() => this.refreshCart(userId)) // Refresh cart after adding item
    );
  }

  // Update product quantity in cart
  updateCartQuantity(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/cart`, { productId, quantity }).pipe(
      tap(() => this.refreshCart(userId)) // Refresh cart after updating quantity
    );
  }

  // Remove product from cart
  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/cart/${productId}`).pipe(
      tap(() => this.refreshCart(userId)) // Refresh cart after removing item
    );
  }

  // Fetch all items in cart
  getCart(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}/cart`).pipe(
      tap((cartItems: any[]) => {
        this.cartItems.next(cartItems); // Update the BehaviorSubject with new cart items
      })
    );
  }


  // Check if product is in cart
  isProductInCart(userId: string, productId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}/cart/${productId}`);
  }

  // Add product to favourites
  addFavourite(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/favourite/${userId}`, { productId });
  }

  // Remove product from favourites
  removeFavourite(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/favourite/${userId}/${productId}`);
  }

  // Check if product is in favourites
  isFavourite(userId: string, productId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}/favourite/${productId}`);
  }

  // Fetch all favourites for a user
  getFavourites(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/favourite/${userId}`);
  }

  // Refresh the cart for the user and update the BehaviorSubject
  private refreshCart(userId: string): void {
    this.getCart(userId).subscribe();
  }
}
