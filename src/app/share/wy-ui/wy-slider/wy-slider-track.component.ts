import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { WySliderStyle } from './wy-slider-type';

@Component({
  selector: 'app-wy-player-track',
  templateUrl: `<div class="wy-slider-track" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class WySliderTrackComponent implements OnInit,OnChanges {
  @Input() wyVertical = false;
  @Input() wyOffset: number;
  style:WySliderStyle = {};
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges): void{
    if(changes.wyOffset){
      if(this.wyVertical){
        this.style['height'] = this.wyOffset + '%';
        this.style.left = null;
        this.style.width = null;
      }else{
        this.style.width = this.wyOffset + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }

}
