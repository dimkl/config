import { envAdapter } from "./envAdapter";
import {
  decorateFnToAllMethods,
  envWrap,
  isEnvWrapped,
  isDefined,
  toScreamingCase,
  cloneStaticProperties,
  isInstanceMethod,
} from "./utils";

type EnvDecorator<T = any> = {
  prefix?: string;
  validate?: (x: T) => T;
  key?: string;
};

const defaultValidate = (x: any) => x;

export function env({
  prefix,
  key,
  validate = defaultValidate,
}: EnvDecorator = {}) {
  const retrieveEnvValue = (propertyKey: string) => {
    const prefixedKey = [prefix, toScreamingCase(propertyKey)]
      .filter(Boolean)
      .join("_");
    const value = key ? envAdapter[key] : envAdapter[prefixedKey];
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

/**
 * Should decorate ONLY classes
 */
export function scope(obj: any) {
  const classWrapper = (constructor: any) => {
    const Cls = class extends constructor {};
    cloneStaticProperties(constructor, Cls, (value, key) =>
      isDefined(obj[key]) ? obj[key] : value
    );

    return Cls as typeof constructor;
  };

  return (target: any, propertyKey?: string) => {
    if (propertyKey) {
      throw new Error("Can only be applied to class");
    }

    return classWrapper(target);
  };
}
