import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/services/data-typels/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  activeIndex = 0;
  banners:Banner[];
  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;

  constructor(private homeservice:HomeService) { 
    this.homeservice.getBanners().subscribe(
      banners => this.banners = banners
    )
  }
  
  ngOnInit(): void {
  }

  beforeChange({to}){
    this.activeIndex = to;
  }
  onChangeSlide(type:string){
    this.nzCarousel[type](); 
  }
}
