import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-wy-player-track',
  templateUrl: `<div class="wy-slider-handle" [ngStyle]="style"></div>`
})
export class WySliderTrackComponent implements OnInit,OnChanges {
  @Input() wyVertical = false;
  @Input() wyOffset: number;

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges

}
