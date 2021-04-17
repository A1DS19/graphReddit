import React from 'react';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@chakra-ui/react';
import { Wrapper } from '../../components/Wrapper';
import { InputField } from '../../components/common/InputField';
import { useCreateUserMutation } from '../../generated/graphql';
import { toErrorMap } from '../../util/2ErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../util/createUrqlClient';

interface registerProps {}

interface UserInput {
  email: string;
  password: string;
  errors?: string[];
}

export const register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useCreateUserMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values: UserInput, helpers: FormikHelpers<UserInput>) => {
          helpers.setSubmitting(true);
          const { data } = await register({ input: values });

          if (data?.createUser?.errors) {
            helpers.setErrors(toErrorMap(data?.createUser?.errors));
          }

          if (!data?.createUser?.errors) {
            helpers.resetForm();
            router.push('/');
          }

          helpers.setSubmitting(false);
        }}
      >
        {(props: FormikProps<UserInput>) => {
          return (
            <Form>
              <InputField name='email' label='Email' placeholder='email' />
              <InputField
                type='password'
                name='password'
                label='Contrasena'
                placeholder='contrasena'
              />
              <Button
                mt={4}
                colorScheme='gray'
                isLoading={props.isSubmitting}
                type='submit'
                color='white'
              >
                Registro
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(register);
