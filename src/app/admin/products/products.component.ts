import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../services/services.service'; // Import your service
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  productForm: FormGroup;

  constructor(private productService: ServicesService, private authService: AuthService) {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      imageUrl: new FormControl(''),
      quantity: new FormControl(''),
      category: new FormControl(''),
      subCategory: new FormControl(''),
      brand: new FormControl(''),
      
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.productForm.patchValue(product);
  }

  addProduct() {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  updateProduct() {
    if (this.productForm.valid && this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct._id, this.productForm.value).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm() {
    this.selectedProduct = null;
    this.productForm.reset();
  }
}
