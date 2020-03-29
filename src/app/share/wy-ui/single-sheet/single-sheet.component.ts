import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { SongSheet } from 'src/app/services/data-typels/common.types';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {

  @Input() sheet:SongSheet;

  constructor() { } 

  ngOnInit(): void {
  }

}
