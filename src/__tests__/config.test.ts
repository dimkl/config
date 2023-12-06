import { config } from "../config";
import { mockEnvs } from "./testHelpers";

describe("@config()", () => {
  describe("decorating classes", () => {
    describe("without options", () => {
      test("sets values for each static property", () => {
        const envs = {
          SETTING_URL_A: "mocked_SETTING_URLA",
          URL_A: "mocked_URLA",
        };
        mockEnvs(envs, () => {
          @config()
          class Config {
            static readonly urlA: string = "";
            static readonly settingUrlA: string = "";
          }
          expect(Config.urlA).toEqual("mocked_URLA");
          expect(Config.settingUrlA).toEqual("mocked_SETTING_URLA");
        });
      });

      test.todo("sets values for each property -- not supported");
    });

    describe("key", () => {
      test("raises error", () => {
        expect(() => {
          @config({ key: "CUSTOM_KEY" })
          class Config {
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }
        }).toThrowError(/Cannot use `key` option when decorating class/);
      });
    });

    describe("prefix", () => {
      test("sets values for each static property", () => {
        const envs = {
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
          PREFIX_URL: "mocked_PREFIX_URL",
        };
        mockEnvs(envs, () => {
          @config({ prefix: "PREFIX" })
          class Config {
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }

          expect(Config.url).toEqual("mocked_PREFIX_URL");
          expect(Config.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
        });
      });

      test.todo("sets values for each property -- not supported");
    });

    describe("adapter", () => {
      test("retrieves value from adapter for each static property value", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };
        const adapters = (x: string) => VALUES[x];

        @config({ prefix: "PREFIX", adapters })
        class Config {
          static readonly url: string = "";
          static readonly settingUrl: string = "";
        }

        expect(Config.url).toEqual("mocked_PREFIX_URL");
        expect(Config.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
      });

      test("with multiple adapters retrieves value from first adapter for each static property value", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
          PREFIX_SETTING2_URL: "mocked_PREFIX_SETTING2_URL",
        };
        const adapter1 = (x: string) => VALUES[x];
        const adapter2 = (x: string) => VALUES[x] + "2";

        @config({ prefix: "PREFIX", adapters: [adapter1, adapter2] })
        class Config {
          static readonly url: string = "";
          static readonly settingUrl: string = "";
          static readonly setting2Url: string = "";
        }

        expect(Config.url).toEqual("mocked_PREFIX_URL");
        expect(Config.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
        expect(Config.setting2Url).toEqual("mocked_PREFIX_SETTING2_URL");
      });

      test.todo(
        "retrieves value from adapter for each property value -- not supported"
      );
    });

    describe("validate", () => {
      test("returns validate result for each static property value", () => {
        const envs = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };

        mockEnvs(envs, () => {
          const clsValidateFn = (x: string) => `class(${x})`;
          @config({ prefix: "PREFIX", validate: clsValidateFn })
          class Config {
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }

          expect(Config.url).toEqual("class(mocked_PREFIX_URL)");
          expect(Config.settingUrl).toEqual("class(mocked_PREFIX_SETTING_URL)");
        });
      });

      test("returns validate result for each static property value (retrieved from adapter)", () => {
        const VALUES: Record<string, string> = {
          URL: "mocked_URL",
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };
        const adapters = (x: string) => VALUES[x];
        const clsValidateFn = (x: string) => `class(${x})`;

        @config({ prefix: "PREFIX", adapters, validate: clsValidateFn })
        class Config {
          static readonly url: string = "";
          static readonly settingUrl: string = "";
        }

        expect(Config.url).toEqual("class(mocked_PREFIX_URL)");
        expect(Config.settingUrl).toEqual("class(mocked_PREFIX_SETTING_URL)");
      });

      test.todo(
        "returns validate result for each property value -- not supported"
      );

      test.todo(
        "returns validate result for each property value (retrieved from adapter) -- not supported"
      );
    });

    describe("initialized value when undefined", () => {
      test("sets values for each static property", () => {
        @config()
        class Config {
          static readonly url: string = "initializedUrl";
          static readonly settingUrl: string = "initializedSettingUrl";
        }

        expect(Config.url).toEqual("initializedUrl");
        expect(Config.settingUrl).toEqual("initializedSettingUrl");
      });
    });
  });

  describe("decorating static property", () => {
    describe("without options", () => {
      test("sets value", () => {
        const envs = { SETTING_URL: "mocked_SETTING_URL", URL: "mocked_URL" };
        mockEnvs(envs, () => {
          class Config {
            @config()
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }
          expect(Config.url).toEqual("mocked_URL");
          expect(Config.settingUrl).toEqual("");
        });
      });
    });

    describe("key", () => {
      test("sets value", () => {
        const envs = {
          CUSTOM_URL: "mocked_CUSTOM_URL",
          CUSTOM_SETTING: "mocked_CUSTOM_SETTING",
          OTHER_URL: "mocked_OTHER_URL",
        };
        mockEnvs(envs, () => {
          class Config {
            @config({ key: "CUSTOM_URL" })
            static readonly url: string = "";
            @config({ key: "CUSTOM_SETTING" })
            static readonly settingUrl: string = "";
            static readonly otherUrl: string = "";
          }

          expect(Config.url).toEqual("mocked_CUSTOM_URL");
          expect(Config.settingUrl).toEqual("mocked_CUSTOM_SETTING");
          expect(Config.otherUrl).toEqual("");
        });
      });

      test("raises error when empty string", () => {
        expect(() => {
          @config({ key: "" })
          class Config {
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }
        }).toThrowError(/Cannot use empty `key` option/);
      });
    });

    describe("prefix", () => {
      test("sets value", () => {
        const envs = {
          OTHER_PREFIX_SETTING_URL: "mocked_OTHER_PREFIX_SETTING_URL",
          PREFIX_URL: "mocked_PREFIX_URL",
          OTHER_URL: "mocked_OTHER_URL",
        };
        mockEnvs(envs, () => {
          class Config {
            @config({ prefix: "PREFIX" })
            static readonly url: string = "";
            @config({ prefix: "OTHER_PREFIX" })
            static readonly settingUrl: string = "";
            @config()
            static readonly otherUrl: string = "";
          }

          expect(Config.url).toEqual("mocked_PREFIX_URL");
          expect(Config.settingUrl).toEqual("mocked_OTHER_PREFIX_SETTING_URL");
          expect(Config.otherUrl).toEqual("mocked_OTHER_URL");
        });
      });

      test("overrides class level prefix", () => {
        const envs = {
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
          PROPERTY_PREFIX_URL: "mocked_PROPERTY_PREFIX_URL",
        };
        mockEnvs(envs, () => {
          @config({ prefix: "PREFIX" })
          class Config {
            @config({ prefix: "PROPERTY_PREFIX" })
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }

          expect(Config.url).toEqual("mocked_PROPERTY_PREFIX_URL");
          expect(Config.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
        });
      });
    });

    describe("adapter", () => {
      test("retrieves value from adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
        };
        const adapters = (x: string) => VALUES[x];

        class Config {
          @config({ prefix: "PREFIX", adapters })
          static readonly url: string = "";
          static readonly settingUrl: string = "";
        }

        expect(Config.url).toEqual("mocked_PREFIX_URL");
        expect(Config.settingUrl).toEqual("");
      });

      test("overrides class level adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
        };
        const adapters = (x: string) => VALUES[x];
        const propertyAdapter = (x: string) => `prop(${VALUES[x]})`;

        @config({ adapters })
        class Config {
          @config({ prefix: "PREFIX", adapters: propertyAdapter })
          static readonly url: string = "";
          static readonly settingUrl: string = "";
        }

        expect(Config.url).toEqual("prop(mocked_PREFIX_URL)");
        expect(Config.settingUrl).toEqual("");
      });
    });

    describe("validate", () => {
      test("uses validate to transform value", () => {
        const envs = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };

        mockEnvs(envs, () => {
          const validate = (x: string) => `prop(${x})`;
          class Config {
            @config({ prefix: "PREFIX", validate })
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }

          expect(Config.url).toEqual("prop(mocked_PREFIX_URL)");
          expect(Config.settingUrl).toEqual("");
        });
      });

      test("uses validate to transform value from adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
          OTHER_PREFIX_SETTING_URL: "mocked_OTHER_PREFIX_SETTING_URL",
        };
        const adapters = (x: string) => VALUES[x];
        const validate = (x: string) => `prop(${x})`;

        class Config {
          @config({ prefix: "PREFIX", adapters, validate })
          static readonly url: string = "";
          @config({ prefix: "OTHER_PREFIX", adapters, validate })
          static readonly settingUrl: string = "";
        }

        expect(Config.url).toEqual("prop(mocked_PREFIX_URL)");
        expect(Config.settingUrl).toEqual(
          "prop(mocked_OTHER_PREFIX_SETTING_URL)"
        );
      });

      test("overrides class level validate", () => {
        const envs = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };

        mockEnvs(envs, () => {
          const clsValidateFn = (x: string) => `class(${x})`;
          const validate = (x: string) => `prop(${x})`;
          @config({ prefix: "PREFIX", validate: clsValidateFn })
          class Config {
            static readonly url: string = "";
            @config({ validate })
            static readonly settingUrl: string = "";
          }

          expect(Config.url).toEqual("class(mocked_PREFIX_URL)");
          expect(Config.settingUrl).toEqual("prop(mocked_PREFIX_SETTING_URL)");
        });
      });
    });
  });

  describe("decorating property", () => {
    describe("without options", () => {
      test("sets value", () => {
        const envs = { SETTING_URL: "mocked_SETTING_URL", URL: "mocked_URL" };
        mockEnvs(envs, () => {
          class Config {
            @config()
            readonly url: string = "";
            readonly settingUrl: string = "";
          }
          const c = new Config();
          expect(c.url).toEqual("mocked_URL");
          expect(c.settingUrl).toEqual("");
        });
      });
    });

    describe("key", () => {
      test("sets value", () => {
        const envs = {
          CUSTOM_URL: "mocked_CUSTOM_URL",
          CUSTOM_SETTING: "mocked_CUSTOM_SETTING",
          OTHER_URL: "mocked_OTHER_URL",
        };
        mockEnvs(envs, () => {
          class Config {
            @config({ key: "CUSTOM_URL" })
            readonly url: string = "";
            @config({ key: "CUSTOM_SETTING" })
            readonly settingUrl: string = "";
            readonly otherUrl: string = "";
          }

          const c = new Config();
          expect(c.url).toEqual("mocked_CUSTOM_URL");
          expect(c.settingUrl).toEqual("mocked_CUSTOM_SETTING");
          expect(c.otherUrl).toEqual("");
        });
      });

      test("raises error when empty string", () => {
        expect(() => {
          class Config {
            @config({ key: "" })
            readonly url: string = "";
            readonly settingUrl: string = "";
          }
        }).toThrowError(/Cannot use empty `key` option/);
      });
    });

    describe("prefix", () => {
      test("sets value", () => {
        const envs = {
          OTHER_PREFIX_SETTING_URL: "mocked_OTHER_PREFIX_SETTING_URL",
          PREFIX_URL: "mocked_PREFIX_URL",
          OTHER_URL: "mocked_OTHER_URL",
        };
        mockEnvs(envs, () => {
          class Config {
            @config({ prefix: "PREFIX" })
            readonly url: string = "";
            @config({ prefix: "OTHER_PREFIX" })
            readonly settingUrl: string = "";
            @config()
            readonly otherUrl: string = "";
          }

          const c = new Config();
          expect(c.url).toEqual("mocked_PREFIX_URL");
          expect(c.settingUrl).toEqual("mocked_OTHER_PREFIX_SETTING_URL");
          expect(c.otherUrl).toEqual("mocked_OTHER_URL");
        });
      });

      test("overrides class level prefix", () => {
        const envs = {
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
          PROPERTY_PREFIX_URL: "mocked_PROPERTY_PREFIX_URL",
        };
        mockEnvs(envs, () => {
          @config({ prefix: "CLASS_PREFIX" })
          class Config {
            @config({ prefix: "PROPERTY_PREFIX" })
            readonly url: string = "";
            @config({ prefix: "PREFIX" })
            readonly settingUrl: string = "";
          }

          const c = new Config();
          expect(c.url).toEqual("mocked_PROPERTY_PREFIX_URL");
          expect(c.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
        });
      });
    });

    describe("adapter", () => {
      test("retrieves value from adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
        };
        const adapters = (x: string) => VALUES[x];

        class Config {
          @config({ prefix: "PREFIX", adapters })
          readonly url: string = "";
          readonly settingUrl: string = "";
        }

        const c = new Config();
        expect(c.url).toEqual("mocked_PREFIX_URL");
        expect(c.settingUrl).toEqual("");
      });

      test("overrides class level adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
        };
        const adapters = (x: string) => VALUES[x];
        const propertyAdapter = (x: string) => `prop(${VALUES[x]})`;

        @config({ adapters })
        class Config {
          @config({ prefix: "PREFIX", adapters: propertyAdapter })
          readonly url: string = "";
          readonly settingUrl: string = "";
        }

        const c = new Config();
        expect(c.url).toEqual("prop(mocked_PREFIX_URL)");
        // TODO: fix this
        // expect(config.settingUrl).toEqual("");
      });
    });

    describe("validate", () => {
      test("uses validate to transform value", () => {
        const envs = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };

        mockEnvs(envs, () => {
          const validate = (x: string) => `prop(${x})`;
          class Config {
            @config({ prefix: "PREFIX", validate })
            readonly url: string = "";
            readonly settingUrl: string = "";
          }

          const c = new Config();
          expect(c.url).toEqual("prop(mocked_PREFIX_URL)");
          expect(c.settingUrl).toEqual("");
        });
      });

      test("uses validate to transform value from adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
          OTHER_PREFIX_SETTING_URL: "mocked_OTHER_PREFIX_SETTING_URL",
        };
        const adapters = (x: string) => VALUES[x];
        const validate = (x: string) => `prop(${x})`;

        class Config {
          @config({ prefix: "PREFIX", adapters, validate })
          readonly url: string = "";
          @config({ prefix: "OTHER_PREFIX", adapters, validate })
          readonly settingUrl: string = "";
        }

        const c = new Config();
        expect(c.url).toEqual("prop(mocked_PREFIX_URL)");
        expect(c.settingUrl).toEqual("prop(mocked_OTHER_PREFIX_SETTING_URL)");
      });

      test("overrides class level validate", () => {
        const envs = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };

        mockEnvs(envs, () => {
          const clsValidate = (x: string) => `class(${x})`;
          const validate = (x: string) => `prop(${x})`;
          @config({ prefix: "PREFIX", validate: clsValidate })
          class Config {
            @config({ prefix: "PREFIX", validate })
            readonly url: string = "";
            readonly settingUrl: string = "";
          }

          const c = new Config();
          expect(c.url).toEqual("prop(mocked_PREFIX_URL)");
          // TODO: fix this
          // expect(config.settingUrl).toEqual("class(mocked_PREFIX_SETTING_URL)");
        });
      });
    });
  });
});
