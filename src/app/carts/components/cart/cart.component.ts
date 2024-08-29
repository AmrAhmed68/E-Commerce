// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../..//services/services.service'; // Adjust path as needed

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: ServicesService) {}

  ngOnInit(): void {
    // In a real application, you might get the cart items from a server
    this.cartItems = this.cartService.getCartItems(); // Adjust this method as needed
  }

  removeFromCart(item: any): void {
    // Implement the method to remove an item from the cart
    this.cartService.removeFromCart(item);
    this.cartItems = this.cartService.getCartItems();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
}
