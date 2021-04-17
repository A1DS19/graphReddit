import { Button } from '@chakra-ui/button';
import { Box, Flex, Link } from '@chakra-ui/react';
import { Formik, FormikHelpers, FormikProps, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../../components/common/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useLoginUserMutation } from '../../generated/graphql';
import { toErrorMap } from '../../util/2ErrorMap';
import { createUrqlClient } from '../../util/createUrqlClient';
import NextLink from 'next/link';

interface loginProps {}

interface UserInput {
  email: string;
  password: string;
  errors?: string[];
}

export const login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, register] = useLoginUserMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values: UserInput, helpers: FormikHelpers<UserInput>) => {
          helpers.setSubmitting(true);
          const { data } = await register({ input: values });

          if (data?.loginUser?.errors) {
            helpers.setErrors(toErrorMap(data?.loginUser?.errors));
          }

          if (!data?.loginUser?.errors) {
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

              <Flex>
                <Button
                  mt={3}
                  colorScheme='gray'
                  isLoading={props.isSubmitting}
                  type='submit'
                  color='white'
                >
                  Login
                </Button>

                <Box mt={2} ml='auto'>
                  <NextLink href='/auth/reset-password'>
                    <Link>Olvido su contrasena?</Link>
                  </NextLink>
                </Box>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(login);
