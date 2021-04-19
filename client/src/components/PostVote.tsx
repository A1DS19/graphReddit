import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface PostVoteProps {
  post: PostSnippetFragment;
}

export const PostVote: React.FC<PostVoteProps> = ({ post }) => {
  type loadingType = 'upLoading' | 'downLoading';
  const [loading, setLoading] = useState<loadingType | 'not-loading'>('not-loading');
  const [, vote] = useVoteMutation();

  const handleVote = async (points: 1 | -1, loadingType: loadingType) => {
    setLoading(loadingType);
    await vote({ value: points, postId: post._id });
    setLoading('not-loading');
  };

  //el valor que se pasa al server viene de aca
  //en este caso si viene un 1 aparece en el value
  //asimismo el -1.
  //console.log(operation?.variables?.value);

  return (
    <Flex textAlign='center' direction='column' mr={4}>
      <Box>
        <IconButton
          isLoading={loading === 'upLoading'}
          onClick={() => handleVote(1, 'upLoading')}
          aria-label='Upvote'
          icon={<ChevronUpIcon />}
        />
        <Text>{post.points}</Text>
        <IconButton
          isLoading={loading === 'downLoading'}
          onClick={() => handleVote(-1, 'downLoading')}
          aria-label='DownVote'
          icon={<ChevronDownIcon />}
        />
      </Box>
    </Flex>
  );
};
