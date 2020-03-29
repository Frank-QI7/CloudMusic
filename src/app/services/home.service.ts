import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet, Singer } from './data-typels/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/internal/operators'
import querystring from 'query-string'

interface SingerParams {
  offset: number;
  limit: number;
  cat?: string;
}

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001'
};

@Injectable({
  // Determines which injectors will provide the injectable
  providedIn: ServicesModule
})
export class HomeService {
    constructor(private http:HttpClient, @Inject(API_CONFIG) private uri:string) { }

  getBanners(): Observable<Banner[]>{
    return this.http.get(this.uri + "banner")
    .pipe(map((res:{banners:Banner[]}) => res.banners))
  }

  getHotTages(): Observable<HotTag[]>{
    return this.http.get(this.uri + "playlist/hot")
    .pipe(map((res:{tags:HotTag[]}) => { 
      return res.tags.sort((x:HotTag,y:HotTag)=>{
        return x.position - y.position
      }).slice(0,5)
    }))
  }

  getPersonalSheetList(): Observable<SongSheet[]>{
    return this.http.get(this.uri + "personalized")
    .pipe(map((res:{result:SongSheet[]}) => res.result.slice(0,16)))
  }

  getEnterSingers(args:SingerParams = defaultParams):Observable<Singer[]>{
    const params = new HttpParams({fromString:querystring.stringify(args)})
    return this.http.get(this.uri + "artist/list",{params})
    .pipe(map((res:{artists:Singer[]})=> res.artists))
  }

  



}
