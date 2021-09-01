import { ObjectId } from "bson";

export class Song {
  constructor({ title, content, id = new ObjectId() }) {
    this._id = id;
    this.title = title;
    this.content = content;
  }

  static schema = {
    name: "Song",
    properties: {
      _id: "objectId",
      title: "string",
      content: "string",
    },
    primaryKey: "_id",
  };
}
