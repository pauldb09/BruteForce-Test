import type {passwordManager as manager} from "./Manager";

export type PasswordGenerateType = {
  length: number,
  characters: Array<String>;
}

export type PasswordManagerOptions = {
  password?: string;
  characters?: Array<String>;
  maxTries: number;
  generate?: PasswordGenerateType;
}

export type PasswordManagerEvent = {
  code: number,
  reason: string,
  password: string,
}

export type RestManagerOptions = {
  timeout: number;
  manager: manager;
  rateLimite?: {
    timeout:number,
    maxPerSecond:number,
  }
}

export type RestRequest = {
    password: string;
}