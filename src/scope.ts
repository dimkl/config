import { isDefined, cloneStaticProperties } from "./utils";

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
