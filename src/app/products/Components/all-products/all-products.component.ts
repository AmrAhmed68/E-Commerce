import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  favouriteProducts: Set<string> = new Set();
  cartProducts: Set<string> = new Set();
  userId : any = localStorage.getItem('id');

  constructor(private productService: ProductService, private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
      this.loadFavourites();
      this.loadCart();
    });
  }

  loadFavourites(): void {
    this.productService.getFavourites(this.userId).subscribe((favourites: any[]) => {
      this.favouriteProducts = new Set(favourites.map((item) => item.productId._id));
    });
  }

  loadCart(): void {
    this.productService.getCart(this.userId).subscribe((cart: any[]) => {
      this.cartProducts = new Set(cart.map((item) => item.productId._id));
    });
  }

  // Check if a product is in favourites
  isFavourite(productId: string): boolean {
    return this.favouriteProducts.has(productId);
  }

  isCard(productId: string): boolean {
    return this.cartProducts.has(productId);
  }

  // Toggle favourite status
  toggleFavourite(productId: string): void {
    if (this.isFavourite(productId)) {
      this.removeFavourite(productId);
    } else {
      this.addFavourite(productId);
    }
  }

  toggleCard(productId: string): void {
    if (this.isCard(productId)) {
      this.removeFromCart(this.userId,productId);
    } else {
      this.addToCart(productId, 1);
    }
  }

  // Add product to favourites
  addFavourite(productId: string): void {
    this.productService.addFavourite(this.userId, productId).subscribe(() => {
      this.favouriteProducts.add(productId);
    });
  }

  // Remove product from favourites
  removeFavourite(productId: string): void {
    this.productService.removeFavourite(this.userId, productId).subscribe(() => {
      this.favouriteProducts.delete(productId);
    });
  }

  viewProductDetails(productId: string): void {
    this.router.navigate([`/product/${productId}`]);
  }

  searchProducts(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  addToCart(productId: string, quantity: number): void {
    this.productService.addToCart(this.userId, productId, quantity).subscribe(() => {
      this.cartProducts.add(productId);
      alert('');
    });
  }

  removeFromCart(userId : string, productId: string): void {
    this.productService.removeFromCart(this.userId, productId).subscribe(() => {
      this.cartProducts.delete(productId);
    });
  }

}
