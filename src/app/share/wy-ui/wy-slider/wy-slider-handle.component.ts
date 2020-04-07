import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { WySliderStyle } from './wy-slider-type';

@Component({
  selector: 'app-wy-player-handle',
  template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit,OnChanges {
  @Input() wyVertical = false;
  @Input() wyOffset: number;
  style:WySliderStyle = {};

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 我们监听 wyOffset 的变化，来动态的改变 style 
    if (changes.wyOffset) {
      // 如果 wyVertical 为 true，那么就改变 bottom 属性，否则去改变 left 属性
      // 偏移量我们用 百分比 来控制
      this.style[this.wyVertical ? 'bottom' : 'left'] = this.wyOffset + '%';
    }
  }
}
