import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { ShareModule } from '../share/share.module';
import { PagesModule } from '../pages/pages.module';



@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    ShareModule,
    PagesModule,
    AppRoutingModule,
  ],
  exports:[
    AppRoutingModule,
    ShareModule
  ]
})
export class CoreModule { 
  // 第一次被 appModule 引入的时候，parentModule 为空，如果再次被其他地方引入的话，就会报错
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 只能被 appModule 引入');
    }
  }
}
