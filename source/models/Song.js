import { UUID } from "bson";

export class Song {
  constructor({ title, content, id = new UUID() }) {
    this._id = id;
    this.title = title;
    this.content = content;
  }

  static schema = {
    name: "Song",
    properties: {
      _id: "uuid",
      title: "string",
      content: "string",
    },
    primaryKey: "_id",
  };
}

export class SongBundle {
  constructor({ title, songs = [], id = new UUID() }) {
    this._id = id;
    this.title = title;
    this.songs = songs;
  }

  static schema = {
    name: "SongBundle",
    properties: {
      _id: "uuid",
      title: "string",
      songs: Song.schema.name + "[]",
    },
    primaryKey: "_id",
  };
}
