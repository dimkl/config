import { env } from "./env";

const mockEnvs = (obj: Record<string, any>, callback: () => void) => {
  const initialValues: Record<string, any> = {};
  Object.keys(obj).forEach((k) => (initialValues[k] = process.env[k]));

  Object.assign(process.env, obj);
  callback();
  Object.assign(process.env, initialValues);
};

describe("@env()", () => {
  describe("decorating classes", () => {
    describe("without options", () => {
      test("sets values for each static property", () => {
        const envs = { SETTING_URL_A: "mocked_SETTING_URLA", URL_A: "mocked_URLA" };
        mockEnvs(envs, () => {
          @env()
          class Config {
            static readonly urlA: string = "";
            static readonly settingUrlA: string = "";
          }
          expect(Config.urlA).toEqual("mocked_URLA");
          expect(Config.settingUrlA).toEqual("mocked_SETTING_URLA");
        });
      });

      test.todo("sets values for each property");
    });

    describe("key", () => {
      test("raises error", () => {
        expect(() => {
          @env({ key: "CUSTOM_KEY" })
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
          @env({ prefix: "PREFIX" })
          class Config {
            static readonly url: string = "";
            static readonly settingUrl: string = "";
          }

          expect(Config.url).toEqual("mocked_PREFIX_URL");
          expect(Config.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
        });
      });

      test.todo("sets values for each property");
    });

    describe("adapter", () => {
      test("retrieves value from adapter for each static property value", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };
        const adapter = (x: string) => VALUES[x];

        @env({ prefix: "PREFIX", adapter })
        class Config {
          static readonly url: string = "";
          static readonly settingUrl: string = "";
        }

        expect(Config.url).toEqual("mocked_PREFIX_URL");
        expect(Config.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
      });

      test.todo("retrieves value from adapter for each property value");
    });

    describe("validate", () => {
      test("returns validate result for each static property value", () => {
        const envs = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };

        mockEnvs(envs, () => {
          const clsValidateFn = (x: string) => `class(${x})`;
          @env({ prefix: "PREFIX", validate: clsValidateFn })
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
        const adapter = (x: string) => VALUES[x];
        const clsValidateFn = (x: string) => `class(${x})`;

        @env({ prefix: "PREFIX", adapter, validate: clsValidateFn })
        class Config {
          static readonly url: string = "";
          static readonly settingUrl: string = "";
        }

        expect(Config.url).toEqual("class(mocked_PREFIX_URL)");
        expect(Config.settingUrl).toEqual("class(mocked_PREFIX_SETTING_URL)");
      });

      test.todo("returns validate result for each property value");

      test.todo(
        "returns validate result for each property value (retrieved from adapter)"
      );
    });

    describe("initialized value when undefined", () => {
      test("sets values for each static property", () => {
        @env()
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
            @env()
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
            @env({ key: "CUSTOM_URL" })
            static readonly url: string = "";
            @env({ key: "CUSTOM_SETTING" })
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
          @env({ key: "" })
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
            @env({ prefix: "PREFIX" })
            static readonly url: string = "";
            @env({ prefix: "OTHER_PREFIX" })
            static readonly settingUrl: string = "";
            @env()
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
          @env({ prefix: "PREFIX" })
          class Config {
            @env({ prefix: "PROPERTY_PREFIX" })
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
        const adapter = (x: string) => VALUES[x];

        class Config {
          @env({ prefix: "PREFIX", adapter })
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
        const adapter = (x: string) => VALUES[x];
        const propertyAdapter = (x: string) => `prop(${VALUES[x]})`;

        @env({ adapter })
        class Config {
          @env({ prefix: "PREFIX", adapter: propertyAdapter })
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
            @env({ prefix: "PREFIX", validate })
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
        const adapter = (x: string) => VALUES[x];
        const validate = (x: string) => `prop(${x})`;

        class Config {
          @env({ prefix: "PREFIX", adapter, validate })
          static readonly url: string = "";
          @env({ prefix: "OTHER_PREFIX", adapter, validate })
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
          @env({ prefix: "PREFIX", validate: clsValidateFn })
          class Config {
            static readonly url: string = "";
            @env({ validate })
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
            @env()
            readonly url: string = "";
            readonly settingUrl: string = "";
          }
          const config = new Config();
          expect(config.url).toEqual("mocked_URL");
          expect(config.settingUrl).toEqual("");
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
            @env({ key: "CUSTOM_URL" })
            readonly url: string = "";
            @env({ key: "CUSTOM_SETTING" })
            readonly settingUrl: string = "";
            readonly otherUrl: string = "";
          }

          const config = new Config();
          expect(config.url).toEqual("mocked_CUSTOM_URL");
          expect(config.settingUrl).toEqual("mocked_CUSTOM_SETTING");
          expect(config.otherUrl).toEqual("");
        });
      });

      test("raises error when empty string", () => {
        expect(() => {
          class Config {
            @env({ key: "" })
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
            @env({ prefix: "PREFIX" })
            readonly url: string = "";
            @env({ prefix: "OTHER_PREFIX" })
            readonly settingUrl: string = "";
            @env()
            readonly otherUrl: string = "";
          }

          const config = new Config();
          expect(config.url).toEqual("mocked_PREFIX_URL");
          expect(config.settingUrl).toEqual("mocked_OTHER_PREFIX_SETTING_URL");
          expect(config.otherUrl).toEqual("mocked_OTHER_URL");
        });
      });

      test("overrides class level prefix", () => {
        const envs = {
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
          PROPERTY_PREFIX_URL: "mocked_PROPERTY_PREFIX_URL",
        };
        mockEnvs(envs, () => {
          @env({ prefix: "CLASS_PREFIX" })
          class Config {
            @env({ prefix: "PROPERTY_PREFIX" })
            readonly url: string = "";
            @env({ prefix: "PREFIX" })
            readonly settingUrl: string = "";
          }

          const config = new Config();
          expect(config.url).toEqual("mocked_PROPERTY_PREFIX_URL");
          expect(config.settingUrl).toEqual("mocked_PREFIX_SETTING_URL");
        });
      });
    });

    describe("adapter", () => {
      test("retrieves value from adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
        };
        const adapter = (x: string) => VALUES[x];

        class Config {
          @env({ prefix: "PREFIX", adapter })
          readonly url: string = "";
          readonly settingUrl: string = "";
        }

        const config = new Config();
        expect(config.url).toEqual("mocked_PREFIX_URL");
        expect(config.settingUrl).toEqual("");
      });

      test("overrides class level adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
        };
        const adapter = (x: string) => VALUES[x];
        const propertyAdapter = (x: string) => `prop(${VALUES[x]})`;

        @env({ adapter })
        class Config {
          @env({ prefix: "PREFIX", adapter: propertyAdapter })
          readonly url: string = "";
          readonly settingUrl: string = "";
        }

        const config = new Config();
        expect(config.url).toEqual("prop(mocked_PREFIX_URL)");
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
            @env({ prefix: "PREFIX", validate })
            readonly url: string = "";
            readonly settingUrl: string = "";
          }

          const config = new Config();
          expect(config.url).toEqual("prop(mocked_PREFIX_URL)");
          expect(config.settingUrl).toEqual("");
        });
      });

      test("uses validate to transform value from adapter", () => {
        const VALUES: Record<string, string> = {
          PREFIX_URL: "mocked_PREFIX_URL",
          OTHER_PREFIX_SETTING_URL: "mocked_OTHER_PREFIX_SETTING_URL",
        };
        const adapter = (x: string) => VALUES[x];
        const validate = (x: string) => `prop(${x})`;

        class Config {
          @env({ prefix: "PREFIX", adapter, validate })
          readonly url: string = "";
          @env({ prefix: "OTHER_PREFIX", adapter, validate })
          readonly settingUrl: string = "";
        }

        const config = new Config();
        expect(config.url).toEqual("prop(mocked_PREFIX_URL)");
        expect(config.settingUrl).toEqual(
          "prop(mocked_OTHER_PREFIX_SETTING_URL)"
        );
      });

      test("overrides class level validate", () => {
        const envs = {
          PREFIX_URL: "mocked_PREFIX_URL",
          PREFIX_SETTING_URL: "mocked_PREFIX_SETTING_URL",
        };

        mockEnvs(envs, () => {
          const clsValidate = (x: string) => `class(${x})`;
          const validate = (x: string) => `prop(${x})`;
          @env({ prefix: "PREFIX", validate: clsValidate })
          class Config {
            @env({ prefix: "PREFIX", validate })
            readonly url: string = "";
            readonly settingUrl: string = "";
          }

          const config = new Config();
          expect(config.url).toEqual("prop(mocked_PREFIX_URL)");
          // TODO: fix this
          // expect(config.settingUrl).toEqual("class(mocked_PREFIX_SETTING_URL)");
        });
      });
    });
  });
});
