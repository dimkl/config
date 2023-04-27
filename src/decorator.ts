import {
  decorateFnToAllMethods,
  envWrap,
  isEnvWrapped,
  isDefined,
  toScreamingCase,
} from "./utils";

type EnvDecorator<T = any> = {
  prefix?: string;
  validate?: (x: T) => T;
  key?: string;
};

export function env({ prefix, key, validate = (x) => x }: EnvDecorator = {}) {
  const retrieveEnvValue = (propertyKey: string) => {
    const prefixedKey = [prefix, toScreamingCase(propertyKey)]
      .filter(Boolean)
      .join("_");
    const value = key ? process.env[key] : process.env[prefixedKey];
    if (isDefined(value)) return validate(value);
  };

  const propertyWrapper = (target: any, propertyKey: string) => {
    if (isEnvWrapped(target, propertyKey)) return;

    const value = retrieveEnvValue(propertyKey);
    target[propertyKey] = isDefined(value) ? value : target[propertyKey];
    envWrap(target, propertyKey);
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
