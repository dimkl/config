import dotenv from "dotenv";
import { config } from "../src";

dotenv.config({ path: "./examples/.env" });

//
// Example 1
//
@config({ prefix: "NEXT_PUBLIC" })
class Config {
  static readonly url: string = "";
  static readonly key: string = "";
  @config({ prefix: "APP" })
  static readonly secretKey: string = "";
  @config({ key: "CUSTOM_KEY_WHATEVER" })
  static readonly custom: string = "";
  @config()
  static readonly databaseUrl: string = "";
}

console.log(Config);
console.log(Object.keys(Config));
console.log(Config.url);

//
// Example 3
// Use Config class instance
//
@config({ prefix: "NEXT_PUBLIC" })
class InstanceConfig {
  readonly url: string = "";
  readonly key: string = "";
  @config({ prefix: "APP" })
  readonly secretKey: string = "";
  @config({ key: "CUSTOM_KEY_WHATEVER" })
  readonly custom: string = "";
  @config()
  readonly databaseUrl: string = "";
}

const c = new InstanceConfig();
console.log(c);
console.log(Object.keys(c));
console.log(c.url);
console.log(c.secretKey);
console.log(c.databaseUrl);

//
// Example 1
//
const VALUES: Record<string, string> = {
  NEXT_PUBLIC_URL: "adapter_NEXT_PUBLIC_URL",
  NEXT_PUBLIC_KEY: "adapter_NEXT_PUBLIC_KEY",
  APP_SECRET_KEY: "adapter_APP_SECRET_KEY",
  CUSTOM_KEY_WHATEVER: "adapter_CUSTOM_KEY_WHATEVER",
};

const adapters = (x: string) => VALUES[x];

@config({ prefix: "NEXT_PUBLIC", adapters })
class CustomAdapterConfig {
  static readonly url: string = "";
  static readonly key: string = "";
  @config({ prefix: "APP", adapters })
  static readonly secretKey: string = "";
  @config({ key: "CUSTOM_KEY_WHATEVER", adapters })
  static readonly custom: string = "";
  @config({ adapters })
  static readonly databaseUrl: string = "";
}

console.log(CustomAdapterConfig);
console.log(Object.keys(CustomAdapterConfig));
console.log(CustomAdapterConfig.url);
