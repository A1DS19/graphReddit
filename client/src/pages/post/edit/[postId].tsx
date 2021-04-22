import { Spinner } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../../components/Layout';
import { usePostQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../util/createUrqlClient';

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const [{ data, fetching, error }] = usePostQuery({ variables: { postId } });

  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  if (fetching) {
    return <Spinner />;
  }

  return <Layout>{data?.getPost?.title}</Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: false })(EditPost);
