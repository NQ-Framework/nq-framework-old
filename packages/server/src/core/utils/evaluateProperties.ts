import { PropertyValue } from '@nqframework/models';
import { evaluateExpression } from './evaluateExpression';

export const evaluateProperties = async (
  properties: PropertyValue[],
  context: any,
): Promise<PropertyValue[]> => {
  if (!properties || !Boolean(properties.length)) {
    return [];
  }
  const propertyValues: PropertyValue[] = [];
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (property.value === undefined || property.value === '') {
      continue;
    }
    if (typeof property.value === 'string' && property.value.startsWith('=')) {
      const result = await evaluateExpression(
        `return ${property.value.slice(1)}`,
        context,
      );
      propertyValues.push({ name: property.name, value: result });
    }
    else if (Array.isArray(property.value)) {
       const result = await evaluateProperties(property.value, context);
      propertyValues.push({ name: property.name, value: result });
    }
    else {
      propertyValues.push({
        name: property.name,
        value: property.value,
      });
    }
  }
  return propertyValues;
};
