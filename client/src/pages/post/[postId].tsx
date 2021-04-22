import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../util/createUrqlClient';

interface PostDetailProps {}

const PostDetail: React.FC<PostDetailProps> = () => {
  const router = useRouter();
  const postId = router.query.postId as string;

  const [{ data, error, fetching }] = usePostQuery({
    pause: !postId,
    variables: { postId },
  });

  if (error) {
    console.log(error);
    return null;
  }

  if (fetching) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (!data?.getPost) {
    return (
      <Layout>
        <Heading>Post no encontrado</Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Heading my={4} size='xl'>
          {data.getPost.title}
        </Heading>
        <Text>{data.getPost.text}</Text>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(PostDetail);
