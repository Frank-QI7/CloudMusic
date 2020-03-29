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
  
export interface SongSheet {
  id: number;
  name: string;
  picUrl:string;
  playCount: number;
}

export interface Singer {
  id: number;
  name: string;
  picUrl:string;
  albumSize: number;
}

  