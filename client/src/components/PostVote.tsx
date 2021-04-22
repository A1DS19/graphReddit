import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { PostSnippetFragment, useMeQuery, useVoteMutation } from '../generated/graphql';

interface PostVoteProps {
  post: PostSnippetFragment;
}

export const PostVote: React.FC<PostVoteProps> = ({ post }) => {
  type loadingType = 'upLoading' | 'downLoading';
  const [loading, setLoading] = useState<loadingType | 'not-loading'>('not-loading');
  const [, vote] = useVoteMutation();
  const [{ data, fetching }] = useMeQuery();
  const [postData, setPostData] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState({
    id: post,
    disabled: true,
  });

  if (fetching) {
    return <Spinner />;
  }

  useEffect(() => {
    data && setPostData(data?.me?.votedPosts.find((post_) => post_.postId === post._id));
  }, [data]);

  const handleVote = async (points: 1 | -1, loadingType: loadingType) => {
    setLoading(loadingType);
    await vote({ value: points, postId: post._id });
    setIsDisabled({ id: points, disabled: true });
    setLoading('not-loading');
  };

  return (
    <Flex textAlign='center' direction='column' mr={4}>
      <Box>
        <IconButton
          disabled={postData?.voteValue === 1}
          isLoading={loading === 'upLoading'}
          onClick={() => handleVote(1, 'upLoading')}
          aria-label='Upvote'
          icon={<ChevronUpIcon />}
        />
        <Text>{post.points}</Text>
        <IconButton
          disabled={postData?.voteValue === -1}
          isLoading={loading === 'downLoading'}
          onClick={() => handleVote(-1, 'downLoading')}
          aria-label='DownVote'
          icon={<ChevronDownIcon />}
        />
      </Box>
    </Flex>
  );
};
