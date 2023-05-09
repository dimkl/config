import dotenv from "dotenv";
import { env, scope } from "../src";

dotenv.config({ path: "./examples/.env" });

//
// Example 1
//
@env({ prefix: "NEXT_PUBLIC" })
class Config {
  static readonly url: string = "";
  static readonly key: string = "";
  @env({ prefix: "APP" })
  static readonly secretKey: string = "";
  @env({ key: "CUSTOM_KEY_WHATEVER" })
  static readonly custom: string = "";
  @env()
  static readonly databaseUrl: string = "";
}

console.log(Config);
console.log(Object.keys(Config));
console.log(Config.url);

//
// Example 2
// Scoping Config class to override properties
//
const ScopedConfig = scope({ url: "1234" })(Config);

console.log(Object.keys(ScopedConfig));
console.log(ScopedConfig.url, Config.url);
console.log(ScopedConfig.databaseUrl);

//
// Example 3
// Use Config class instance
//
@env({ prefix: "NEXT_PUBLIC" })
class InstanceConfig {
  readonly url: string = "";
  readonly key: string = "";
  @env({ prefix: "APP" })
  readonly secretKey: string = "";
  @env({ key: "CUSTOM_KEY_WHATEVER" })
  readonly custom: string = "";
  @env()
  readonly databaseUrl: string = "";
}

const config = new InstanceConfig();
console.log(config);
console.log(Object.keys(config));
console.log(config.url);
console.log(config.secretKey);
console.log(config.databaseUrl);

//
// Example 1
//
const VALUES: Record<string, string> = {
  NEXT_PUBLIC_URL: "adapter_NEXT_PUBLIC_URL",
  NEXT_PUBLIC_KEY: "adapter_NEXT_PUBLIC_KEY",
  APP_SECRET_KEY: "adapter_APP_SECRET_KEY",
  CUSTOM_KEY_WHATEVER: "adapter_CUSTOM_KEY_WHATEVER",
};

const adapter = (x: string) => VALUES[x];

@env({ prefix: "NEXT_PUBLIC", adapter })
class CustomAdapterConfig {
  static readonly url: string = "";
  static readonly key: string = "";
  @env({ prefix: "APP", adapter })
  static readonly secretKey: string = "";
  @env({ key: "CUSTOM_KEY_WHATEVER", adapter })
  static readonly custom: string = "";
  @env({ adapter })
  static readonly databaseUrl: string = "";
}

console.log(CustomAdapterConfig);
console.log(Object.keys(CustomAdapterConfig));
console.log(CustomAdapterConfig.url);
