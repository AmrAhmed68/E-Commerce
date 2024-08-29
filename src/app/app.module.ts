import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { ProductsDetailsComponent } from './products/Components/products-details/products-details.component';
import { AllProductsComponent } from './products/Components/all-products/all-products.component';
import { CartComponent } from './carts/components/cart/cart.component';
import { HeaderComponent } from './shared/header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './account/components/login/login.component';
import { SignupComponent } from './account/components/signup/signup.component';
import { SliderComponent } from './home/slider/slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeComponent } from './home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProfileComponent } from './account/components/profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './admin/products/products.component';
import { SectionsComponent } from './home/sections/sections.component';

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    ProductsDetailsComponent,
    AllProductsComponent,
    CartComponent,
    LoginComponent,
    SignupComponent,
    SliderComponent,
    HomeComponent,
    ProfileComponent,
    AdminComponent,
    ProductsComponent,
    SectionsComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    CarouselModule,
    FormsModule
  ],
  exports: [
    HeaderComponent
  ],

  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
