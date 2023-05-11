export function decorateFnToAllMethods(
  constructor: any,
  handler: (target: any, x: string) => any
) {
  getStaticProperties(constructor).forEach((propertyKey) => {
    constructor[propertyKey] = handler(constructor, propertyKey);
  });

  // TODO: fix this -> currently it does not return any instance property
  // getInstanceProperties(constructor).forEach((propertyKey) => {
  //   const descriptor = Object.getOwnPropertyDescriptor(
  //     constructor.prototype,
  //     propertyKey
  //   );
  //   if (descriptor?.configurable) {
  //     Object.defineProperty(constructor.prototype, propertyKey, {
  //       get() {
  //         return handler(constructor.prototype, propertyKey);
  //       },
  //       configurable: true,
  //     });
  //   } else {
  //     console.log(propertyKey, "is not configurable");
  //   }
  // });
}

type TransformFn = (value: any, key: string) => any;

export function cloneStaticProperties(
  source: any,
  target: any,
  transform: TransformFn = (x) => x
) {
  getStaticProperties(source).forEach((propertyKey) => {
    target[propertyKey] = transform(source[propertyKey], propertyKey);
    const options = OptionsHandler.retrieve(source, propertyKey);
    if (options) {
      OptionsHandler.persist(target, options, propertyKey);
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

// export function getInstanceProperties(constructor: Function): string[] {
//   return Object.getOwnPropertyNames(constructor.prototype).filter(
//     (m) => !["constructor"].includes(m)
//   );
// }

export function toScreamingCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toUpperCase()
    .replace(/^_/, "");
}

export function isDefined(value: any) {
  return value !== undefined;
}

export class OptionsHandler {
  static persist<T>(cls: any, options: T, method?: string) {
    const currentOptions = { ...cls[this.generateKey(method)] };
    // merge current with new options
    cls[this.generateKey(method)] = { ...currentOptions, ...options };
  }

  static retrieve<T>(cls: any, method?: string): Required<T> {
    const methodOptions = cls[this.generateKey(method)];
    const classOptions = cls[this.generateKey()];

    return {
      ...classOptions,
      ...methodOptions,
    };
  }

  static generateKey(method?: string) {
    return Symbol.for(["options", method].filter((x) => !!x).join(":"));
  }
}
