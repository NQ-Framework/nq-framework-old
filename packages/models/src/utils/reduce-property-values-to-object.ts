import { PropertyValue } from "../workflow/property/property-value";

export const reducePropertyValuesToObject = (
  values: PropertyValue[],
  recurse = true
) => {
  return values.reduce((obj: any, prop: PropertyValue) => {
    if (
      recurse &&
      Array.isArray(prop.value) &&
      (prop.value.length === 0 || Array.isArray(prop.value[0].value))
    ) {
      const arrayValues: any[] = [];
      prop.value.forEach((arrayValue) => {
        arrayValues.push(reducePropertyValuesToObject(arrayValue.value));
      });
      if (arrayValues.length) {
        const keys = Object.keys(arrayValues[0]);
        if (keys.length === 1 && keys[0] === prop.name) {
          obj[prop.name] = arrayValues.map((v) => v[prop.name]);
          return obj;
        }
      }
      obj[prop.name] = arrayValues;
      return obj;
    } else {
      obj[prop.name] = prop.value;
      return obj;
    }
  }, {});
};
