import React, { Fragment, useState } from 'react';
import { Alert, AlertIcon, Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Formik, FormikHelpers, FormikProps, Form } from 'formik';
import { InputField } from '../../components/common/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useSendForgetPassEmailMutation } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../util/createUrqlClient';
import { Layout } from '../../components/Layout';

interface ResetPasswordProps {}

interface ChangePassInput {
  email: string;
  errors?: string[];
}

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
  const [, sendEmail] = useSendForgetPassEmailMutation();
  const [msg, setMsg] = useState('');

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (
          values: ChangePassInput,
          helpers: FormikHelpers<ChangePassInput>
        ) => {
          helpers.setSubmitting(true);
          await sendEmail({ email: values.email });
          setMsg('Si el email existe, el correo fue enviado.');
          helpers.setSubmitting(false);
        }}
      >
        {(props: FormikProps<ChangePassInput>) => {
          return (
            <Fragment>
              {msg && (
                <Alert status='info'>
                  <AlertIcon />
                  {msg}
                </Alert>
              )}

              {!msg ? (
                <Form>
                  <InputField name='email' label='Email' placeholder='email' />
                  <Flex>
                    <Button
                      mt={3}
                      colorScheme='gray'
                      isLoading={props.isSubmitting}
                      type='submit'
                      color='white'
                    >
                      Cambiar Contrasena
                    </Button>
                  </Flex>
                </Form>
              ) : (
                <Box mt={2} textAlign='center'>
                  <NextLink href='/'>
                    <Link>Volver a inicio</Link>
                  </NextLink>
                </Box>
              )}
            </Fragment>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ResetPassword);
