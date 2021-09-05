import Db from "../db";

export class Song {
  constructor({
                title, content,
                id = Db.songs.getIncrementedPrimaryKey(Song.schema),
              }) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  static schema = {
    name: "Song",
    properties: {
      id: "int",
      title: "string",
      content: "string",
    },
    primaryKey: "id",
  };
}

export class SongBundle {
  constructor({
                title, songs = [],
                id = Db.songs.getIncrementedPrimaryKey(SongBundle.schema),
              }) {
    this.id = id;
    this.title = title;
    this.songs = songs;
  }

  static schema = {
    name: "SongBundle",
    properties: {
      id: "int",
      title: "string",
      songs: Song.schema.name + "[]",
    },
    primaryKey: "id",
  };
}
