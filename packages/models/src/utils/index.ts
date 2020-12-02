import { PropertyValue } from "../workflow/property/property-value";

export const reducePropertyValuesToObject = (values: PropertyValue[]) => {
  return values.reduce((obj: any, prop: PropertyValue) => {
    obj[prop.name] = prop.value;
    return obj;
  }, {});
};
