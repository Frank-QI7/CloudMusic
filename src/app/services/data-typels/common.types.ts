export interface Banner {
    targetId: number;
    url: string;
    imageUrl: string;
  }

export interface HotTag {
  id: number;
  name: string;
  position: number;
}

export interface Singer {
  id: number;
  name: string;
  picUrl:string;
  albumSize: number;
}
  
export interface SongSheet {
  id: number;
  name: string;
  picUrl:string;
  playCount: number;
  tracks: Song[];
}

export interface Song {
  id: number;
  name: string;
  url: string;    //  真实的 track 中是没有 url 的
  ar: Singer[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
}

// 播放地址
export interface SongUrl {
  id: number;
  url: string;
}

  