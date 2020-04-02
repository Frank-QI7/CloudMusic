import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet, Singer, SongUrl, Song } from './data-typels/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map, pluck, switchMap} from 'rxjs/internal/operators'
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

  getSongSheet(id:number): Observable<SongSheet>{
    const param = new HttpParams().set('id',id.toString())
    return this.http.get(this.uri + 'playlist/detail',{params:param})
    .pipe(map((res:{playlist:SongSheet}) => res.playlist))
  }

  getSong(ids:string):Observable<SongUrl[]>{
    const param = new HttpParams().set('id',ids)
    return this.http.get(this.uri + 'song/url',{params:param})
    .pipe(map((res:{data:SongUrl[]}) => res.data))
  }

  // 我们有可能只播放一首歌，也可能从歌单从获取好几首歌曲
  getSongList(songs: Song | Song[]):Observable<Song[]>{
    const songArr = Array.isArray(songs)?songs.slice():[songs];
    const ids = songArr.map(song => song.id).join(',');
    // 我们要对返回数据做拼接，让他返回的数据正好符合 Song 这个数据结构，然后页面可以直接循环使用
    return this.getSong(ids).pipe(map(urls => this.generateSongList(songArr, urls)));
  }

  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find(songUrl => songUrl.id === song.id).url;
      if (url) {
        result.push({ ...song, url });
      }
    });
    return result;
  }



  // 在点击获取播放列表的时候，我们首先获取的数据是 SongSheet，然后根据 SongSheet 里的 track 字段
  // 获取 Song 的数据， 然后根据 Song 里的 id 字段来 getSongList，getSongList 的作用就是
  // 把 id 处理一下，然后方便调用 getSong。
  playSheet(id:number):Observable<Song[]>{
    // pluck 的作用是选择字段来发出。
    return this.getSongSheet(id)
    .pipe(pluck('tracks'),switchMap(tracks => this.getSongList(tracks)))
  }

}
