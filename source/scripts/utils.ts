import { Alert } from "react-native";

export function dateFrom(date: Date | string): Date {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
}

export class Result {
  success: boolean;
  message?: string;
  error?: Error;

  constructor(success: boolean,
              message?: string,
              error?: Error) {
    this.success = success;
    this.message = message;
    this.error = error;
  }

  alert() {
    Alert.alert(
      this.success ? "Success" : "Error",
      this.message || this.error?.toString() || ""
    );
  }

  throwIfException() {
    if (this.error !== undefined) {
      throw this.error;
    }
  }
}
