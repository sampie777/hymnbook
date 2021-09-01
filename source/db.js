import Realm from "realm";
import { Song } from "./models/Song";

class Database {
  realm = undefined;
  path = "hymnbook_songs";
  schemas = [Song.schema];
  _isConnected = false;
  schemaVersion = 2;

  constructor() {
    this.config = {
      path: this.path,
      schema: this.schemas,
      schemaVersion: this.schemaVersion,
    };
  }

  async connect() {
    if (this.isConnected()) {
      console.warn("Database is already connected.");
      this.disconnect();
    }

    this._isConnected = false;
    this.realm = await Realm.open(this.config).then(it => {
      this._isConnected = true;
      return it;
    });

    return this.realm;
  }

  disconnect() {
    this._isConnected = false;
    if (this.realm === null || this.realm === undefined) {
      console.warn("Database is already disconnected");
      return;
    }
    this.realm.close();
  }

  isConnected = () => this._isConnected;

  deleteDb() {
    if (this.realm !== null && this.realm !== undefined) {
      this.disconnect();
    }

    console.warn("Deleting database");
    Realm.deleteFile(this.config);
  }
}

const Db = new Database();

export default Db;
