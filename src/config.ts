import {
  decorateFnToAllMethods,
  isDefined,
  toScreamingCase,
  isInstanceMethod,
  OptionsHandler,
} from "./utils";

type ConfigDecorator<T = any> = {
  key?: string;
  prefix?: string;
  validate?: (x: T) => T;
  adapter?: (x: string) => T;
};

const defaultValidate = (x: any) => x;
const configAdapter = (key: string) => process.env[key];

export function config(options: ConfigDecorator = {}) {
  if (options.key?.trim()?.length === 0) {
    throw new Error("Cannot use empty `key` option");
  }

  const retrieveValue = (target: any, propertyKey: string) => {
    const {
      prefix,
      key,
      adapter = configAdapter,
      validate = defaultValidate,
    } = OptionsHandler.retrieve<ConfigDecorator>(target, propertyKey);
    const prefixedKey = [prefix, toScreamingCase(propertyKey)]
      .filter(Boolean)
      .join("_");
    const value = adapter(key || prefixedKey);
    if (isDefined(value)) return validate(value);

    return target[propertyKey];
  };

  const staticPropertyWrapper = (target: any, propertyKey: string) => {
    target[propertyKey] = retrieveValue(target, propertyKey);
  };

  const instancePropertyWrapper = (target: any, propertyKey: string) => {
    return {
      get: () => retrieveValue(target, propertyKey),
      set: () => null,
    };
  };

  const propertyWrapper = (target: any, propertyKey: string) => {
    OptionsHandler.persist(target, options, propertyKey);
    return isInstanceMethod(target)
      ? instancePropertyWrapper(target, propertyKey)
      : staticPropertyWrapper(target, propertyKey);
  };

  const classWrapper = (constructor: any) => {
    if (options.key) {
      throw new Error("Cannot use `key` option when decorating class");
    }
    OptionsHandler.persist(constructor, options);
    decorateFnToAllMethods(constructor, retrieveValue);
    return constructor;
  };

  return (target: any, propertyKey?: string) => {
    return !propertyKey
      ? classWrapper(target)
      : propertyWrapper(target, propertyKey);
  };
}