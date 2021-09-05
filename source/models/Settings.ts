import Db from "../db";

export interface SettingProps {
  key: string;
  value: string;
}

export class Setting {
  key: string = "";
  value: string = "";

  constructor({ key, value }: SettingProps) {
    this.key = key;
    this.value = value;
  }

  static schema = {
    name: "Settings",
    primaryKey: "key",
    properties: {
      key: "string",
      value: "string"
    }
  };
}

class SettingsProvider {
  static set(key: string, value: string) {
    if (!Db.settings.isConnected()) {
      return;
    }

    Db.settings.realm().write(() => {
      // @ts-ignore
      Db.settings.realm().create(Setting.schema.name,
        new Setting({ key, value }),
        "all");
    });
  }

  static setNumber(key: string, value: number) {
    const stringValue = value.toString();
    return this.set(key, stringValue);
  }

  static get(key: string): string | undefined {
    if (!Db.settings.isConnected()) {
      return undefined;
    }

    const value = Db.settings.realm().objects(Setting.schema.name).filtered(`key = "${key}"`);
    if (value === null || value === undefined) {
      return undefined;
    }
    return (value[0] as unknown as Setting).value;
  }

  static getNumber(key: string): number | undefined {
    const stringValue = this.get(key);
    if (stringValue === undefined) {
      return undefined;
    }

    return +stringValue;
  }
}

class SettingsClass {
  maxSearchInputLength = 3;
  maxSearchResultsLength = 40;

  songBundlesApiUrl = "http://192.168.0.148:8080";

  songScale = 1.0;
  songVerseTextSize = 18;

  load() {
    console.log("Loading settings");
    Object.entries(this).forEach(([key, value]) => {
      const dbValue = this.loadValueFor(key, value);
      if (dbValue !== undefined) {
        // @ts-ignore
        this[key] = dbValue;
      }
    });
  }

  private loadValueFor(key: string, value: any) {
    switch (typeof value) {
      case "string":
        return SettingsProvider.get(key);
      case "number":
        return SettingsProvider.getNumber(key);
      default:
        console.error("No matching get function found for type of key: " + key);
    }
  }

  store() {
    console.log("Storing settings");
    Object.entries(this).forEach(([key, value]) => {
      switch (typeof value) {
        case "string":
          return SettingsProvider.set(key, value);
        case "number":
          return SettingsProvider.setNumber(key, value);
        default:
          console.error("No matching set function found for type of key: " + key);
      }
    });
  }

  get(key: string): any {
    // @ts-ignore
    return this[key];
  }
}

const Settings = new SettingsClass();
export default Settings;
