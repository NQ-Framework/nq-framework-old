import { PropertyValue } from "@nqframework/models";

export const convertPropertiesToFormValues = (properties: PropertyValue[]) : any => {
    if (!properties || !properties.length) {
        return {};
    }
    const result: any = {};
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (Array.isArray(property.value)) {
            const subResult: any[] = [];
            property.value.forEach(val=> {
                subResult.push(convertPropertiesToFormValues(val.value));
            });
            result[property.name] = subResult;
        }
        else {
            result[property.name] = property.value;
        }
    }
    return result;
}


export const convertFormValuesToProperties = (values: any) : PropertyValue[] => {
    const keys = Object.keys(values);
    const result: PropertyValue[] = [];
    keys.forEach(k => {
        if (Array.isArray(values[k])) {
            let array: any = [];
            values[k].forEach((v: any) => {
                let subArray: PropertyValue[] = [];
                if (typeof v === 'object' && v !== null) {
                    subArray = subArray.concat(convertFormValuesToProperties(v));
                }
                else {
                    subArray.push({ name: k, value: v });
                }
                array.push({ name: "item", value: subArray });
            });
            result.push({ name: k, value: array });
        }
        else if (typeof values[k] === 'object' && values[k] !== null) {
            result.push({ name: k, value: convertFormValuesToProperties(values[k]) });
        }
        else {
            result.push({ name: k, value: values[k] });
        }
    })
    return result;
}