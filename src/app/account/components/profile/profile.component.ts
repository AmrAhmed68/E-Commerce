// In your Angular component (e.g., `profile.component.ts`)

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadUserProfile(): void {
    const user = this.authService.getUser();
    if (user && user._id) {
      this.userId = user._id;
      this.authService.getUserById(this.userId).subscribe({
        next: (userData) => {
          this.profileForm.patchValue({
            username: userData.username || '',
            email: userData.email || '',
            age: userData.age || '',
            phone: userData.phone || '',
            gender: userData.gender || '',
          });
        },
        error: (error) => {
          console.error('Error loading user profile', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.userId) {
      const updatedProfile = { ...this.profileForm.value, userId: this.userId };
      this.authService.updateUser(updatedProfile).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          // Optionally, navigate to another page or show a success message
        },
        error: (error) => {
          console.error('Error updating profile', error);
        }
      });
    }
  }
}
