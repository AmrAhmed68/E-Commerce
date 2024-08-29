import { Component, OnInit } from '@angular/core';
import {PhotoService} from '../services/service.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css'
})
export class SectionsComponent implements OnInit {

  mostPopular: any[] = [];
  leastPopular: any[] = [];
  bestOffers: any[] = [];

  constructor(private productService: PhotoService , private router : Router) {}

  ngOnInit(): void {
    this.loadProducts('mostPopular'); // Load products for "Most Popular"
    this.loadProducts('leastPopular'); // Load products for "Least Popular"
    this.loadProducts('bestOffers');   // Load products for "Best Offers"
  }

  loadProducts(subCategory: string): void {
    this.productService.getProducts(subCategory).subscribe({
      next: (response) => {
        if (subCategory === 'mostPopular') {
          this.mostPopular = response.mostPopular;
        } else if (subCategory === 'leastPopular') {
          this.leastPopular = response.leastPopular;
        } else if (subCategory === 'bestOffers') {
          this.bestOffers = response.bestOffers;
        }
      },
      error: (error) => {
        console.error('Error loading products', error);
      }
    });
  }

  viewProductDetails(productId: string): void {
    this.router.navigate([`/product/${productId}`]);
  }

}
