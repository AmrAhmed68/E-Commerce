import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/services.service'; // Service to handle authentication
import { filter } from 'rxjs/operators';
import {ServicesService} from '../../carts/services/services.service'

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
  currentRoute: string = '';
  cartCount: number = 0;


  constructor(private authService: AuthService, private router: Router , private cartService: ServicesService  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
      this.updateVisibility();
    });
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

    isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Toggle sidebar for mobile view
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Check login status and set username
  checkLoginStatus() {
    this.authService.authStatus$.subscribe(isLoggedIn => {
      this.username = isLoggedIn ? this.authService.getUser()?.username : null;
      this.updateVisibility();
    });
  }

  // Update visibility of search bar and profile section
  updateVisibility() {
    const excludedRoutes = ['/account/login', '/account/signup', '/account/profile'];
    this.showSearchBar = !excludedRoutes.includes(this.currentRoute);
  }

  // Toggle profile dropdown
  toggleProfileDropdown() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  // Log out user
  logout() {
    this.authService.logout();
  }
}
