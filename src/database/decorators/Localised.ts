import { ClassType } from '../../types/ClassType';

const LocalisedDecoratorStorage = new WeakMap<object, string[]>();

export function Localised(): PropertyDecorator {
  return (target: object, property: string | symbol): void => {
    const targetConstructor: Function = target.constructor;
    LocalisedDecoratorStorage.set(targetConstructor, [...LocalisedDecoratorStorage.get(targetConstructor) ?? [], property.toString()]);
  };
}

export function getLocalisedProperties<TClass>(classType: ClassType<TClass>): Array<keyof TClass> {
  const localisedProperties: string[] = [];
  let target: Function | undefined = classType;
  while (target?.name) {
    const properties: string[] | undefined = LocalisedDecoratorStorage.get(target);
    if (properties) {
      localisedProperties.push(...properties);
    }
    target = (target as any).__proto__;
  }
  return [...new Set(localisedProperties)] as Array<keyof TClass>;
}
