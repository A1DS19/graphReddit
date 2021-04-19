import React, { InputHTMLAttributes } from 'react';
import { FormControl, FormLabel, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';

type InputFieldProps = InputHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
};

export const TextAreaField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error} mt={3}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Textarea id={field.name} placeholder={props.placeholder} {...field} {...props} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
