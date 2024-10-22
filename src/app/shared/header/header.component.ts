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

  selectedFile: File | null = null;
  username: string | null = null;
  isSidebarOpen = false;
  isProfileOpen = false;
  showSearchBar = true;
  currentRoute: string = '';
  cartCount: number = 0;
  isAdmin = false;



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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.authService.uploadLogo(formData).subscribe(
      (response: any) => {
        console.log('Logo uploaded successfully:', response);
      },
      error => {
        console.error('Error uploading logo:', error);
      }
    );
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
      this.updateVisibility();
      console.log(this.isAdmin)
    });
  }

  updateVisibility() {
    const excludedRoutes = ['/account/login', '/account/signup', '/account/profile'];
    this.showSearchBar = !excludedRoutes.includes(this.currentRoute);
  }

  toggleProfileDropdown() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout() {
    this.authService.logout();
  }
}
