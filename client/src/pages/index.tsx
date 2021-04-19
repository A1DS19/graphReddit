import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';
import { Layout } from '../components/Layout';
import React, { Fragment } from 'react';
import { Stack, Box, Heading, Text, Button, Flex, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { PostVote } from '../components/PostVote';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null });
  //requestPolicy: 'cache-and-network',
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>ERROR SORRY</div>;
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>Cargando...</div>
      ) : (
        <Fragment>
          <Stack m={5} spacing={5}>
            {data!.getPosts.posts.map((post) => (
              <Flex key={post._id} p={5} shadow='md' borderWidth='1px'>
                <PostVote post={post} />
                <Box mt={2}>
                  <Heading fontSize='xl'>{post.title}</Heading>
                  <Text mt={1}>Posteado por: {post.creator.email}</Text>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
          {data && (
            <Flex>
              <Button
                isLoading={fetching}
                disabled={!data.getPosts.hasMore}
                size='lg'
                m='auto'
                my={6}
                onClick={() =>
                  setVariables({
                    limit: variables.limit,
                    cursor: data.getPosts.posts[data.getPosts.posts.length - 1].createdAt,
                  })
                }
              >
                Ver Mas
              </Button>
            </Flex>
          )}
        </Fragment>
      )}
    </Layout>
  );
};

//activar server side rendering
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
