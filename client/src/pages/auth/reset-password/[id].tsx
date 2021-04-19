import { Alert, AlertIcon, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { Fragment } from 'react';
import { useState } from 'react';
import { InputField } from '../../../components/common/InputField';
import { Wrapper } from '../../../components/Wrapper';
import { useChangePasswordMutation } from '../../../generated/graphql';
import { toErrorMap } from '../../../util/2ErrorMap';
import { createUrqlClient } from '../../../util/createUrqlClient';
import NextLink from 'next/link';

interface UserInput {
  newPassword: string;
  errors?: string[];
}

const ResetPassword: NextPage<{ id: string }> = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values: UserInput, helpers: FormikHelpers<UserInput>) => {
          helpers.setSubmitting(true);
          const { data } = await changePassword({
            input: {
              token: typeof router.query.id === 'string' ? router.query.id : '',
              newPassword: values.newPassword,
            },
          });

          if (data?.changePassword?.errors) {
            const errMap = toErrorMap(data?.changePassword?.errors);

            if ('token' in errMap) {
              setTokenError(errMap.token);
            }

            helpers.setErrors(errMap);
          }

          if (!data?.changePassword?.errors) {
            helpers.resetForm();
            router.push('/');
          }

          helpers.setSubmitting(false);
        }}
      >
        {(props: FormikProps<UserInput>) => {
          return (
            <Fragment>
              {tokenError && (
                <Alert status='error'>
                  <AlertIcon />
                  <Flex>
                    {tokenError}
                    <NextLink href='/auth/reset-password'>
                      <Link ml={2}>Nueva contrasena</Link>
                    </NextLink>
                  </Flex>
                </Alert>
              )}
              <Form>
                <InputField
                  type='password'
                  name='newPassword'
                  label='Nueva Contrasena'
                  placeholder='nueva contrasena'
                />
                <Button
                  mt={4}
                  colorScheme='gray'
                  isLoading={props.isSubmitting}
                  type='submit'
                  color='white'
                >
                  Crear
                </Button>
              </Form>
            </Fragment>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ResetPassword);
