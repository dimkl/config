type EnvDecorator<T = any> = {
  prefix?: string;
  defaultValue?: T;
  validate?: Function;
  key?: string;
};

export function env({
  prefix,
  defaultValue,
  validate,
  key,
}: EnvDecorator = {}) {
  return function envWrapper(target: any, propertyKey: string) {
    console.log(`Decorator called for ${propertyKey} on ${target}`);
  };
}
