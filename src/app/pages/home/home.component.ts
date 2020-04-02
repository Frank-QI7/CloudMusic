import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-typels/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { HomeService } from 'src/app/services/home.service';

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

  constructor(private route: ActivatedRoute, private homeService:HomeService) { 
    this.route.data.pipe(map(res => res.HomeData)).subscribe(([banners,tags,result,artists]) =>{
      this.banners = banners;
      this.tags = tags;
      this.sheets = result;
      this.singers = artists;
    })
  }
  
  ngOnInit(): void {
  }

  beforeChange({to}){
    this.activeIndex = to;
  }
  onChangeSlide(type:string){
    this.nzCarousel[type](); 
  }

  onPlaySheet(id:number){
    this.homeService.getSongSheet(id).subscribe(res => {
      
    })
  }
}
