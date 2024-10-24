// In your Angular component (e.g., `profile.component.ts`)

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/services.service';
import { Router } from '@angular/router';
import { AuthServices } from '../../service/service.service'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

profileData: any;

 profile: any = {};

  constructor(private profileService: AuthServices , private authService: AuthService) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(data => {
      this.profile = data;
    }, error => {
      console.error('Error fetching profile data', error);
    });

  }

  // getProfile() {
  //   this.profileService.getProfile().subscribe(
  //     (data) => {
  //       this.profileData = data;
  //       console.log('Profile data fetched successfully', data);
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error('Error fetching profile data', error);
  //       if (error.status === 401) {
  //         console.log('Unauthorized: Token may be missing or expired');
  //       } else if (error.status === 403) {
  //         console.log('Forbidden: Token might be invalid');
  //       } else {
  //         console.log('An unknown error occurred');
  //       }
  //     }
  //   );
  // }

  onSubmit() {
    this.profileService.updateProfile(this.profile).subscribe(response => {
      console.log('Profile updated successfully', response);
    }, error => {
      console.error('Error updating profile', error);
    });
  }

  logout() {
    this.authService.logout();
  }
}
