import { Component, OnInit } from '@angular/core';
import { FormControl ,FormGroup, Validators } from '@angular/forms';
import { customValidators } from './customValidators';
import { AuthService } from '../../service/service.service';  // Import the service
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.myForm = new FormGroup({
      username : new FormControl('' , [Validators.required , Validators.minLength(5)]),
      password : new FormControl(null , [Validators.required , customValidators.passWordValidators()]),
      retypePassword : new FormControl(null,Validators.required),
      email : new FormControl(null , [Validators.required , Validators.email , ]),
      age : new FormControl(null),
      phone : new FormControl(null),
      gender : new FormControl(null),
  }, {
    validators : customValidators.matchPassword
  })
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('retypePassword')?.value
      ? null : { 'passwordMismatch': true };
  }

  submitForm() {
    if (this.myForm.valid) {
      this.authService.signUp(this.myForm.value).subscribe({
        next: (response) => {
          console.log('User created successfully', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error occurred during sign up', error);
        }
      });
    }
  }

}
