import { Component, OnInit } from '@angular/core';
import { FormControl ,FormGroup, Validators } from '@angular/forms';
import { customValidators } from './customValidators';
import { AuthService } from '../../../shared/services/services.service';  // Import the service
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private authService: AuthService , private router: Router) {}

  ngOnInit(): void {
    this.myForm = new FormGroup({
      password : new FormControl(null , [Validators.required , customValidators.passWordValidators()]),
      username : new FormControl(null , [Validators.required , ]),
  })
  }

  submitForm() {
    if (this.myForm.valid) {
      const loginData = this.myForm.value;
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          // const isAdmin = response.isAdmin;
          const isAdmin = user.isAdmin;


          if (typeof isAdmin === 'undefined') {
            console.error('isAdmin is not defined in the response');
            return;
          }

          localStorage.setItem('authToken', response.token); // Store token

          if (isAdmin) {
            this.router.navigate(['/admin']); // Redirect to admin dashboard
          } else {
            this.router.navigate(['/home']); // Redirect to user home page
          }
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}
