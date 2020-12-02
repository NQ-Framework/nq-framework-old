import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { Property } from '@nqframework/models/build/workflow/property/property';
import { Field, FormikProps } from 'formik';
import * as React from 'react';
import { InputControl } from './input-control';

export const FormProperty: React.FC<{
  formikProps: FormikProps<any>;
  prop: Property;
}> = ({ formikProps, prop }) => {
  const name = prop.name;
  return (
    <Field name={name} key={name}>
      {({ field, form }: any) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel htmlFor={name}>{prop.description}</FormLabel>
          <InputControl
            fieldProperty={prop}
            {...field}
            id={name}
            placeholder={prop.description}
          />
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
