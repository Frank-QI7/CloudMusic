import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Input, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SliderEventObserverConfig } from './wy-slider-type';
import { fromEvent, Observable, Subscription, merge } from 'rxjs';
import { tap, pluck, map, filter, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class WySliderComponent implements OnInit,OnDestroy {
  private sliderDom: HTMLDivElement;
  @ViewChild('wy-slider',{static:true}) private wySlider:ElementRef
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;

  private isDragging: boolean = false;
  private value: number | null = null;
  private offset:number | null = null;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private dragStart_: Subscription | null; // 必须是 Subscription 类型
  private dragMove_: Subscription | null;
  private dragEnd_: Subscription | null;

  // 这是 angular 已经注入的 DOCUMENT 对象，我们可以这样直接用
  constructor(@Inject(DOCUMENT) private doc: Document, private cdr:ChangeDetectorRef) { }
  ngOnDestroy(): void {
    this.unsubscribeDrag()
  }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservables(){
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start:'mousedown',
      move:'mousemove',
      end:'mouseup',
      filter:(e:MouseEvent) => e instanceof MouseEvent,
      pluckKey:[orientField]
    };

    const touch: SliderEventObserverConfig = {
      start:'touchstart',
      move:'touchmove',
      end:'touchend',
      filter:(e:TouchEvent) => e instanceof TouchEvent,
      pluckKey:['touch','0',orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filter1, pluckKey } = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start)
      .pipe(
        filter(filter1),
        tap((e:Event) => {
          e.stopPropagation();
          e.preventDefault();
        }),
        pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );
      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filter1),
        tap((e:Event) => {
          e.stopPropagation();
          e.preventDefault();
        }),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$); 
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  // 因为我们想让这个函数能 subscribe 多个状态，所以参数是一个数组
  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    // 必须 this.dragStart$ && !this.dragStart_
    if (events.indexOf('start') !== -1  && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (events.indexOf('move') !== -1 && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (events.indexOf('end') !== -1 && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unsubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (events.indexOf('start') !== -1 && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (events.indexOf('move') !== -1  && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (events.indexOf('end') !== -1  && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }



  // 因为在 subcribe 的时候，我们绑定的是 this，所以会接收到 value 值
  private onDragStart(value: number) {
    // 触发开启移动
     this.toggleDragMoving(true);
     this.setValue(value);
     
  }
  private onDragMove(value: number) {
    if(this.isDragging){
      // 如果用户正在滑动，那么我们要把此时的 value 传给 dom，完成渲染
      this.setValue(value);
      // 要求 dom 去更新
      this.cdr.markForCheck()
    }
  }
  private onDragEnd() {
    this.toggleDragMoving(false);
    this.cdr.markForCheck()
  }

  private toggleDragMoving(move:boolean){
    this.isDragging = move;
    if(move){
      // 如果用户正在滑动，那么订阅 move 和 end 事件
      this.subscribeDrag(['move','end'])
    }else{
      // 如果用户停止了滑动，那么取消订阅 move 和 end 事件
      this.unsubscribeDrag(['move','end'])
    }
  }



  private setValue(val:number){
    // 在这优化一下，当不相等的时候才去更新
    if(this.value !== val){
      // 我们要把 value 保存到我们到 model 里，传给 view（dom）
      this.value = val;
      this.updateTrackAndHandle();
    }
  }

  private updateTrackAndHandle(){
    this.offset = (this.value - this.wyMin) / (this.wyMax - this.wyMin) * 100;
    this.cdr.markForCheck()

  }

  private findClosestValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();

    // 滑块(左, 上)端点位置
    const sliderStart = this.getSliderStartPosition();

    // 滑块当前位置 / 滑块总长
    const ratio = this.limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    // 当滑块为 垂直 的时候，sliderStart 在位置在滑块的 最上面，而不是最下面！！！！！！所以需要 1 - ratio
    const ratioTrue = this.wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }


  private getSliderLength(): number {
    // Get the height and width of an element, including padding:
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition(): number {
    const offset = this.getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }

  private limitNumberInRange(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  }
  

  private getElementOffset(el: HTMLElement): { top: number; left: number; } {
    if (!el.getClientRects().length) {
      return {
        top: 0,
        left: 0
      };
    }

    const rect = el.getBoundingClientRect();
    const win = el.ownerDocument.defaultView;

    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    };
}


}
