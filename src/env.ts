import {
  decorateFnToAllMethods,
  envWrap,
  isEnvWrapped,
  isDefined,
  toScreamingCase,
  isInstanceMethod,
} from "./utils";

type EnvDecorator<T = any> = {
  key?: string;
  prefix?: string;
  validate?: (x: T) => T;
  adapter?: (x: string) => T;
};

const defaultValidate = (x: any) => x;
const envAdapter = (key: string) => process.env[key];

export function env({
  key,
  prefix,
  validate = defaultValidate,
  adapter = envAdapter,
}: EnvDecorator = {}) {
  const retrieveEnvValue = (propertyKey: string) => {
    const prefixedKey = [prefix, toScreamingCase(propertyKey)]
      .filter(Boolean)
      .join("_");
    const value = adapter(key || prefixedKey);
    if (isDefined(value)) return validate(value);
  };

  const staticPropertyWrapper = (target: any, propertyKey: string) => {
    if (isEnvWrapped(target, propertyKey)) return;

    const value = retrieveEnvValue(propertyKey);
    target[propertyKey] = isDefined(value) ? value : target[propertyKey];
    envWrap(target, propertyKey);
  };

  const instancePropertyWrapper = (target: any, propertyKey: string) => {
    if (isEnvWrapped(target, propertyKey)) return;
    envWrap(target, propertyKey);

    const value = retrieveEnvValue(propertyKey);
    return {
      get: () => (isDefined(value) ? value : target[propertyKey]),
      set: () => null,
    };
  };

  const propertyWrapper = (target: any, propertyKey: string) => {
    return isInstanceMethod(target)
      ? instancePropertyWrapper(target, propertyKey)
      : staticPropertyWrapper(target, propertyKey);
  };

  const classWrapper = (constructor: any) => {
    decorateFnToAllMethods(constructor, retrieveEnvValue);
    return constructor;
  };

  return (target: any, propertyKey?: string) => {
    return !propertyKey
      ? classWrapper(target)
      : propertyWrapper(target, propertyKey);
  };
}