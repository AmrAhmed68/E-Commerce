import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './products/Components/all-products/all-products.component';
import { ProductsDetailsComponent } from './products/Components/products-details/products-details.component';
import { CartComponent } from './carts/components/cart/cart.component';
import { LoginComponent } from './account/components/login/login.component';
import { SignupComponent } from './account/components/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './account/components/profile/profile.component';
import { ProductsComponent } from './admin/products/products.component';

const routes: Routes = [
  {path : "products" , component:AllProductsComponent},
  {path : "home" , component: HomeComponent},
  {path : "product/:id" , component:ProductsDetailsComponent},
  {path : "admin" , component:ProductsComponent},
  { path: 'account/login', component: LoginComponent },
  { path: 'account/signup', component: SignupComponent },
  { path: 'account/profile', component: ProfileComponent },
  {path : "cart" , component:CartComponent},
  {path : "**" , redirectTo:"home" , pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

