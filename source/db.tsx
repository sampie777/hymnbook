import Realm from "realm";
import { Song, SongBundle } from "./models/Song";

class Database {
  _realm: Realm | null = null;
  path = "hymnbook_songs";
  schemas = [Song.schema, SongBundle.schema];
  _isConnected = false;
  schemaVersion = 1;

  config: Realm.Configuration;

  constructor() {
    this.config = {
      path: this.path,
      schema: this.schemas,
      schemaVersion: this.schemaVersion,
    };
  }

  async connect() {
    if (this.isConnected()) {
      console.info("Database is already connected.");
      this.disconnect();
    }

    this._isConnected = false;
    this._realm = await Realm.open(this.config).then(it => {
      this._isConnected = true;
      return it;
    });

    return this._realm;
  }

  disconnect() {
    this._isConnected = false;
    if (this._realm == null) {
      return;
    }
    this._realm.close();
    this._realm = null;
  }

  isConnected = () => {
    if (this._isConnected && this._realm == null) {
      this._isConnected = false;
    }
    return this._isConnected;
  };

  realm = () => {
    if (this._realm == null) {
      throw Error("Cannot use realm: realm is null");
    }
    return this._realm;
  }

  deleteDb() {
    if (this.isConnected()) {
      this.disconnect();
    }

    console.warn("Deleting database");
    Realm.deleteFile(this.config);
  }
}

const Db = new Database();

export default Db;
