import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/services.service';
import { Router } from '@angular/router';
import {ServicesService} from '../../../carts/services/services.service'

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';

  constructor(private productService: ProductService, private router: Router ,private cartService: ServicesService // Inject CartService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data; // Initialize filteredProducts with all products
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

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }

}
