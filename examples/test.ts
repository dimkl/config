import dotenv from "dotenv";
import { env } from "../src";

dotenv.config({ path: "./examples/.env" });

@env({ prefix: "NEXT_PUBLIC_CLERK" })
class Config {
  static readonly frontendApi: string = "";
  static readonly publishableKey: string = "";
  @env({ prefix: "CLERK" })
  static readonly secretKey: string = "";
  @env({ key: "CUSTOM_KEY_WHATEVER" })
  static readonly custom: string = "";
  @env()
  static readonly databaseUrl: string = "";
}

console.log(Config);
console.log(Object.keys(Config));
console.log(Config.frontendApi);