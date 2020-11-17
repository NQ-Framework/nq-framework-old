import { PropertyValue } from '@nqframework/models';

export const reducePropertyValuesToObject = (values: PropertyValue[]) => {
  return values.reduce((obj: any, prop: PropertyValue) => {
    obj[prop.name] = prop.value;
    return obj;
  }, {});
};
