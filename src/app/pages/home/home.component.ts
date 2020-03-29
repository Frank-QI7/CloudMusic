import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-typels/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  activeIndex = 0;
  banners:Banner[];
  tags:HotTag[];
  sheets:SongSheet[];
  singers:Singer[];
  
  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;

  constructor(private homeservice:HomeService) { 
    this.getBanners();
    this.getHotTags();
    this.getPersonalSheetList();
    this.getEnterSingers();
  }
  
  ngOnInit(): void {
  }

  getBanners(){
    this.homeservice.getBanners().subscribe(
      banners => this.banners = banners
    )
  }

  getHotTags(){
    this.homeservice.getHotTages().subscribe(
      tags => this.tags = tags
    )
  }

  getPersonalSheetList(){
    this.homeservice.getPersonalSheetList().subscribe(
      result => this.sheets = result
    )
  }

  getEnterSingers(){
    this.homeservice.getEnterSingers().subscribe(
      artists => this.singers = artists
    )
  }


  beforeChange({to}){
    this.activeIndex = to;
  }
  onChangeSlide(type:string){
    this.nzCarousel[type](); 
  }
}
