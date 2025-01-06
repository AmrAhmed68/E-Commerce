// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../products/services/services.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  loading: boolean = false;
  userId : any = localStorage.getItem('id');
  cart: any[] = [];
  totalPrice: number = 0;    // Stores the total price


  constructor( private productService: ProductService ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Load cart items
  loadCart() {
    this.loading = true;  // Set loading to true when the request starts

    this.productService.getCart(this.userId).subscribe(
      (response) => {
        this.cart = response;
        this.calculateTotalPrice();
        this.loading = false;  // Set loading to false when the request finishes
      },
      (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;  // Set loading to false in case of error
      }
    );
  }

  // Calculate total price
  calculateTotalPrice(): void {
    this.totalPrice = this.cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  }

  // Method to update quantity
  updateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = Number(input.value);

    if (quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }

    this.loading = true;  // Set loading to true when the update starts

    this.productService.updateCartQuantity(this.userId, productId, quantity).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        console.error('Error updating cart:', error);
        this.loading = false;  // Set loading to false in case of error
      }
    );
  }
  removeFromCart(productId: string): void {
    this.productService.removeFromCart(this.userId, productId).subscribe(() => {
      this.loadCart();
    });
  }

  }
