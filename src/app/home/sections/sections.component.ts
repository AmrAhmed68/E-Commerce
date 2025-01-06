import { Component, OnInit } from '@angular/core';
import {PhotoService} from '../services/service.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css'
})
export class SectionsComponent implements OnInit {

  MostPopular: any[] = [];
  LastAdded: any[] = [];
  BestOffers: any[] = [];

  constructor(private productService: PhotoService , private router : Router) {}

  ngOnInit(): void {
    this.loadProducts('Most Popular');
    this.loadProducts('Last Added');
    this.loadProducts('Best Offers');
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

  viewProductDetails(productId: string): void {
    this.router.navigate([`/product/${productId}`]);
  }

}
