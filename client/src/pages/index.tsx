import { withUrqlClient } from 'next-urql';
import { useDeletePostMutation, useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';
import { Layout } from '../components/Layout';
import React, { Fragment } from 'react';
import {
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { PostVote } from '../components/PostVote';
import NextLink from 'next/link';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null });
  const [, deletePost] = useDeletePostMutation();
  const [{ data: myData }] = useMeQuery();
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
            {data!.getPosts.posts.map((post) =>
              !post ? null : (
                <Flex key={post._id} p={5} shadow='md' borderWidth='1px'>
                  <PostVote post={post} />
                  <Box mt={2}>
                    <Heading fontSize='xl'>
                      <NextLink href='/post/[postId]' as={`/post/${post._id}`}>
                        <Link>{post.title.slice(0, 50)}</Link>
                      </NextLink>
                    </Heading>
                    <Text mt={1}>Posteado por: {post.creator.email}</Text>
                    <Text mt={3}>{post.textSnippet}</Text>
                  </Box>
                  {myData?.me?._id === post.creator._id && (
                    <Box ml='auto'>
                      <NextLink href='/post/edit/[postId]' as={`/post/edit/${post._id}`}>
                        <IconButton aria-label='Edit' icon={<EditIcon />} />
                      </NextLink>
                      <IconButton
                        ml={2}
                        onClick={() => deletePost({ postId: post._id })}
                        aria-label='Destroy'
                        icon={<DeleteIcon color='red' />}
                      />
                    </Box>
                  )}
                </Flex>
              )
            )}
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
