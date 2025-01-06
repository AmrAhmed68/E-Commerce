import { Component, OnInit } from '@angular/core';
import {PhotoService} from '../services/service.service'
import { Router } from '@angular/router';
import { ProductService } from '../../products/services/services.service';
@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css'
})
export class SectionsComponent implements OnInit {

  MostPopular: any[] = [];
  LastAdded: any[] = [];
  BestOffers: any[] = [];
  favouriteProducts: Set<string> = new Set();
  cartProducts: Set<string> = new Set();
  userId : any = localStorage.getItem('id');

  constructor(private productService: PhotoService , private router : Router ,private favouriteService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts('Most Popular');
    this.loadProducts('Last Added');
    this.loadProducts('Best Offers');
    this.loadFavourites();
    this.loadCart();
  }

  loadProducts(subCategory: string): void {
    this.productService.getProducts(subCategory).subscribe({
      next: (response) => {
        if (subCategory === 'Most Popular') {
          this.MostPopular = response;
        } else if (subCategory === 'Last Added') {
          this.LastAdded = response;
        } else if (subCategory === 'Best Offers') {
          this.BestOffers = response;
        }
      },
      error: (error) => {
        console.error('Error loading products', error);
      }
    });
  }

  loadCart(): void {
    this.favouriteService.getCart(this.userId).subscribe((cart: any[]) => {
      this.cartProducts = new Set(cart.map((item) => item.productId._id));
    });
  }

  isCard(productId: string): boolean {
    return this.cartProducts.has(productId);
  }

  toggleCard(productId: string): void {
    if (this.isCard(productId)) {
      this.removeFromCart(this.userId,productId);
    } else {
      this.addToCart(productId, 1);
    }
  }

  viewProductDetails(productId: string): void {
    this.router.navigate([`/product/${productId}`]);
  }

  loadFavourites(): void {
    this.favouriteService.getFavourites(this.userId).subscribe((favourites: any[]) => {
      this.favouriteProducts = new Set(favourites.map((item) => item.productId._id));
    });
  }

  // Check if a product is in favourites
  isFavourite(productId: string): boolean {
    return this.favouriteProducts.has(productId);
  }

  // Toggle favourite status
  toggleFavourite(productId: string): void {
    if (this.isFavourite(productId)) {
      this.removeFavourite(productId);
    } else {
      this.addFavourite(productId);
    }
  }

  addToCart(productId: string, quantity: number): void {
    this.favouriteService.addToCart(this.userId, productId, quantity).subscribe(() => {
      this.cartProducts.add(productId);
    });
  }

  removeFromCart(userId : string, productId: string): void {
    this.favouriteService.removeFromCart(this.userId, productId).subscribe(() => {
      this.cartProducts.delete(productId);
    });
  }

  // Add product to favourites
  addFavourite(productId: string): void {
    this.favouriteService.addFavourite(this.userId, productId).subscribe(() => {
      this.favouriteProducts.add(productId);
    });
  }

  // Remove product from favourites
  removeFavourite(productId: string): void {
    this.favouriteService.removeFavourite(this.userId, productId).subscribe(() => {
      this.favouriteProducts.delete(productId);
    });
  }

}
