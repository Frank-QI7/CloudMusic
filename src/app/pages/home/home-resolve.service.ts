import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-typels/common.types';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(private homeservice:HomeService) {}

  resolve(): Observable<HomeDataType> {
    return forkJoin([
        this.homeservice.getBanners(),
        this.homeservice.getHotTages(),
        this.homeservice.getPersonalSheetList(),
        this.homeservice.getEnterSingers()
      ]).pipe(first());
  }
}