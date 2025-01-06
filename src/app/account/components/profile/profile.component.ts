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
      this.profile = data.user;
    }, error => {
      console.error('Error fetching profile data', error);
    });
  }

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
