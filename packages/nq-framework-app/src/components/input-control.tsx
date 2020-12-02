import * as React from 'react';
import {
  Checkbox,
  CheckboxProps,
  Input,
  InputProps,
  Select,
  SelectProps,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';
import { Property } from '@nqframework/models/build/workflow/property/property';
import { organizationContext } from '../core/organization-context';
import { useContext } from 'react';

export interface InputControlProps {
  fieldProperty: Property;
}

export const InputControl: React.FC<
  InputControlProps & (InputProps | SelectProps | TextareaProps | CheckboxProps)
> = ({ fieldProperty, ...rest }) => {
  const { organization } = useContext(organizationContext);

  if (fieldProperty.type === 'string') {
    return <Input {...(rest as any)} />;
  }
  if (fieldProperty.type === 'js-expression') {
    return <Textarea {...(rest as any)} />;
  }
  if (fieldProperty.type === 'boolean') {
    return <Checkbox {...(rest as any)} />;
  }
  if (fieldProperty.type === 'select-one') {
    if (
      !fieldProperty.selectOptions ||
      fieldProperty.selectOptions.length === 0
    ) {
      return (
        <div>
          Invalid field setup, select-one needs to provide selectOptions
        </div>
      );
    }
    return (
      <Select {...(rest as any)}>
        {fieldProperty.selectOptions.map((so: any) => (
          <option key={so.value} value={so.value}>
            {so.name}
          </option>
        ))}
      </Select>
    );
  }
  if (fieldProperty.type === 'credentials') {
    if (!organization || !organization.dataCredentials) {
      return (
        <div>
          Invalid field setup, could not find any credentials for this
          organization
        </div>
      );
    }
    return (
      <Select {...(rest as any)}>
        {organization.dataCredentials.map((dc) => (
          <option key={dc.name} value={dc.name}>
            {dc.name}
          </option>
        ))}
      </Select>
    );
  }
  return <div>Unknown field type</div>;
};
