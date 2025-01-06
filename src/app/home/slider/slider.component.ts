import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  images: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getImages();
  }

  getImages(): void {
    this.http.get<any[]>('https://e-commerce-data-one.vercel.app/api/slider')
      .subscribe(data => {
        this.images = data;
      });
  }
}
