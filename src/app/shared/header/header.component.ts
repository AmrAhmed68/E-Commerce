import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/services.service'; // Service to handle authentication
import { filter } from 'rxjs/operators';
import {ServicesService} from '../../carts/services/services.service'
import { ProductService } from '../../products/services/services.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username: string | null = null;
  isSidebarOpen = false;
  isProfileOpen = false;
  showSearchBar = true;
  cartCount: number = 0;
  isAdmin = false;
  logoUrl: string = '';
  userId: string | null = null;


  constructor(private authService: AuthService,
    private router: Router ,
    private cartService: ServicesService ,
    private productService: ProductService ,
    @Inject(PLATFORM_ID) private platformId: Object
) {}

  ngOnInit(): void {
    this.productService.cartItems$.subscribe(
      (cartItems) => {
        this.cartCount = cartItems.length; // Update cart count dynamically
      },
      (error) => {
        console.error('Error updating cart count', error);
      }
    );    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('id');
    }
    this.getCartDetails();
    this.authService.authStatus$.subscribe(status => {
      if (status) {
        const user = this.authService.getUser();
        if (user) {
          this.username = user.username;
        }
      }
    });

    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
    }

  }

  getCartDetails() {
    if (this.userId) {
      this.productService.getCart(this.userId).subscribe(
        (cartItems) => {
          this.cartCount = cartItems.length; // Count the number of items in the cart
        },
        (error) => {
          console.error('Error fetching cart details', error);
        }
      );
    }
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  checkLoginStatus() {
    this.authService.authStatus$.subscribe(isLoggedIn => {
      this.username = isLoggedIn ? this.authService.getUser()?.username : null;
      this.isAdmin = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}').isAdmin === true : false;
    });
  }

  toggleProfileDropdown() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout() {
    this.authService.logout();
  }
}
