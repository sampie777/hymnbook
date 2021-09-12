import Db from "../scripts/db";
import { Song } from "./Songs";


export class SongListSongModel {
  id: number;
  index: number;
  song: Song;

  constructor(
    index: number,
    song: Song,
    id = Db.songs.getIncrementedPrimaryKey(SongListSongModel.schema)
  ) {
    this.id = id;
    this.index = index;
    this.song = song;
  }

  static schema = {
    name: "SongListSong",
    properties: {
      id: "int",
      index: "int",
      song: Song.schema.name
    },
    primaryKey: "id"
  };
}


export class SongListModel {
  id: number;
  name: string;
  songs: Array<SongListSongModel>;
  createdAt: Date;
  modifiedAt: Date;

  constructor(
    name: string,
    createdAt: Date = new Date(),
    modifiedAt: Date = new Date(),
    songs: Array<SongListSongModel> = [],
    id = Db.songs.getIncrementedPrimaryKey(SongListModel.schema)
  ) {
    this.id = id;
    this.name = name;
    this.songs = songs;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
  }

  static schema = {
    name: "SongList",
    properties: {
      id: "int",
      name: "string",
      createdAt: "date",
      modifiedAt: "date",
      songs: SongListSongModel.schema.name + "[]"
    },
    primaryKey: "id"
  };
}
