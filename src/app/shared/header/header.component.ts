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
  isAdmin = false;
  logoUrl: string = '';

  constructor(private authService: AuthService, private router: Router , private cartService: ServicesService  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
    });

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

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
