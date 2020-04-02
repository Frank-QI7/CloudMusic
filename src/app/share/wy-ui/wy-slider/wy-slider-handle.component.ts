import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-player-handle',
  template: `<div class="wy-slider-track" [ngStyle]="style"></div>`,
})
export class WySliderHandleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
