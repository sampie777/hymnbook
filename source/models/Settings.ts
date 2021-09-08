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
