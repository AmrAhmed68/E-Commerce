import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = 'http://localhost:5000/api/auth'; // Adjust URL as needed
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();

  constructor(private http: HttpClient) {}

  addToCart(product: any, quantity: number = 1) {
    this.http.post(`${this.apiUrl}/card`, { productId: product._id, quantity })
      .subscribe(
        () => {
          // On success, update local cart count
          this.cartCount.next(this.cartCount.getValue() + quantity);
        },
        error => {
          console.error('Error adding to cart', error);
        }
      );
  }

  removeFromCart(product: any) {
    // Remove item logic if needed
  }

  getCartItems(): any[] {
    // Implement if necessary
    return [];
  }

  getCartCount(): number {
    return this.cartCount.getValue();
  }
}
