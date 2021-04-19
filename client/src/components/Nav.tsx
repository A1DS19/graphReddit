import { Box, Flex, Heading, Spacer } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../util/isServer';

interface NavProps {}

export const Nav: React.FC<NavProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  //loading
  if (fetching) {
  }

  //not authenticated
  if (!data?.me) {
    body = (
      <Fragment>
        <Link href='/auth/register'>
          <Button mr={4}>Registro</Button>
        </Link>

        <Link href='/auth/login'>
          <Button>Login</Button>
        </Link>
      </Fragment>
    );
  }

  //authenticated
  if (data?.me) {
    body = (
      <Flex>
        <Link href='/profile/me'>
          <Box mt={2}>{data.me.email}</Box>
        </Link>
        <Link href='/post/create'>
          <Button ml={3} mr={3}>
            Crear Post
          </Button>
        </Link>
        <Button isLoading={logoutFetching} onClick={() => logout()}>
          Salir
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='gray.700' p={4}>
      <Box>
        <Link href='/'>
          <Heading mt={2} cursor='pointer' size='md'>
            GraphReddit
          </Heading>
        </Link>
      </Box>
      <Spacer />
      {body}
    </Flex>
  );
};
