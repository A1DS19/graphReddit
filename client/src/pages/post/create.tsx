import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { Formik, FormikHelpers, FormikProps, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { Fragment } from 'react';
import { InputField } from '../../components/common/InputField';
import { TextAreaField } from '../../components/common/TextAreaField';
import { createUrqlClient } from '../../util/createUrqlClient';
import { useCreatePostMutation, useMeQuery } from '../../generated/graphql';
import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Layout } from '../../components/Layout';
import { useIsAuth } from '../../hooks/useIsAuth';

interface createProps {}

interface CreatePostInput {
  title: string;
  text: string;
  errors?: [];
}

const Create: React.FC<createProps> = ({}) => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  useIsAuth();

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (
          values: CreatePostInput,
          helpers: FormikHelpers<CreatePostInput>
        ) => {
          helpers.setSubmitting(true);
          const { error } = await createPost({ input: values });

          if (!error) {
            router.push('/');
          }

          helpers.setSubmitting(false);
        }}
      >
        {(props: FormikProps<CreatePostInput>) => {
          return (
            <Fragment>
              <Form>
                <InputField name='title' label='Titulo' placeholder='titulo' />
                <TextAreaField name='text' label='Contenido' placeholder='contenido' />

                <Button
                  mt={3}
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
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Create);
