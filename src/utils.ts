export function decorateFnToAllMethods(
  constructor: any,
  handler: (x: string) => any
) {
  getStaticProperties(constructor).forEach((propertyKey) => {
    if (isEnvWrapped(constructor, propertyKey)) return;

    constructor[propertyKey] = handler(propertyKey);
    envWrap(constructor, propertyKey);
  });

  getInstanceProperties(constructor).forEach((propertyKey) => {
    if (isEnvWrapped(constructor.prototype, propertyKey)) return;
    Object.defineProperty(constructor.prototype, propertyKey, {
      get() {
        return handler(propertyKey);
      },
    });

    envWrap(constructor, propertyKey);
  });
}

type TransformFn = (value: any, key: string) => any;

export function cloneStaticProperties(
  source: any,
  target: any,
  transform: TransformFn = (x) => x
) {
  getStaticProperties(source).forEach((propertyKey) => {
    target[propertyKey] = transform(source[propertyKey], propertyKey);
    if (isEnvWrapped(source, propertyKey)) {
      envWrap(target, propertyKey);
    }
  });
}

export function isInstanceMethod(target: any): boolean {
  return !target.prototype;
}

export function getStaticProperties(constructor: Function): string[] {
  return Object.getOwnPropertyNames(constructor).filter(
    (m) => !["constructor", "length", "name", "prototype"].includes(m)
  );
}

export function getInstanceProperties(constructor: Function): string[] {
  return Object.getOwnPropertyNames(constructor.prototype).filter(
    (m) => !["constructor"].includes(m)
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
  return !!target[Symbol.for(`envWrapped:${key}`)];
}

export function envWrap(target: any, key: string) {
  target[Symbol.for(`envWrapped:${key}`)] = true;
}
