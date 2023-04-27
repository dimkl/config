import { env } from "../src";

class Config {
  @env({ prefix: "NEXT_PUBLI_DIMKL", defaultValue: true, key: "" })
  static readonly envValue: boolean;
}
