export function decorateFnToAllMethods(
  constructor: any,
  handler: (x: string) => any
) {
  getStaticProperties(constructor).forEach((propertyKey) => {
    if (isEnvWrapped(constructor, propertyKey)) return;

    constructor[propertyKey] = handler(propertyKey);
    envWrap(constructor, propertyKey);
  });
}

export function getStaticProperties(constructor: Function): string[] {
  return Object.getOwnPropertyNames(constructor).filter(
    (m) => !["constructor", "length", "name", "prototype"].includes(m)
  );
}

export function toScreamingCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toUpperCase()
    .replace(/^_/, "");
}

export function isDefined(value: any) {
  return value !== undefined;
}

export function isEnvWrapped(target: any, key: string) {
  return target[Symbol.for(`envWrapped:${key}`)];
}

export function envWrap(target: any, key: string) {
  target[Symbol.for(`envWrapped:${key}`)] = true;
}
