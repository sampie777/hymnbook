import Db from "../scripts/db";

export class Verse {
  id: number;
  name: string;
  content: string;
  language: string;
  index: number;

  constructor(
    index: number,
    name: string,
    content: string,
    language: string,
    id = Db.songs.getIncrementedPrimaryKey(Verse.schema)
  ) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.language = language;
    this.index = index;
  }

  static schema = {
    name: "Verse",
    properties: {
      id: "int",
      name: "string",
      content: "string",
      language: "string",
      index: "int",
    },
    primaryKey: "id"
  };
}

export class Song {
  id: number;
  name: string;
  author: string;
  copyright: string;
  language: string;
  verses: Array<Verse>;
  createdAt: Date;
  modifiedAt: Date;

  constructor(
    name: string,
    author: string,
    copyright: string,
    language: string,
    createdAt: Date,
    modifiedAt: Date,
    verses: Array<Verse> = [],
    id = Db.songs.getIncrementedPrimaryKey(Song.schema)
  ) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.copyright = copyright;
    this.language = language;
    this.verses = verses;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
  }

  static schema = {
    name: "Song",
    properties: {
      id: "int",
      name: "string",
      author: "string",
      copyright: "string",
      language: "string",
      createdAt: "date",
      modifiedAt: "date",
      verses: Verse.schema.name + "[]"
    },
    primaryKey: "id"
  };
}

export class SongBundle {
  id: number;
  abbreviation: string;
  name: string;
  language: string;
  songs: Array<Song>;
  createdAt: Date;
  modifiedAt: Date;

  constructor(
    abbreviation: string,
    name: string,
    language: string,
    createdAt: Date,
    modifiedAt: Date,
    songs: Array<Song> = [],
    id = Db.songs.getIncrementedPrimaryKey(SongBundle.schema)
  ) {
    this.id = id;
    this.abbreviation = abbreviation;
    this.name = name;
    this.language = language;
    this.songs = songs;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
  }

  static schema = {
    name: "SongBundle",
    properties: {
      id: "int",
      abbreviation: "string",
      name: "string",
      language: "string",
      createdAt: "date",
      modifiedAt: "date",
      songs: Song.schema.name + "[]"
    },
    primaryKey: "id"
  };
}
