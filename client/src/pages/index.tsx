import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';
import { Nav } from '../components/Nav';
import { Fragment } from 'react';
import { isServer } from '../util/isServer';

const Index = () => {
  const [{ data }] = usePostsQuery();

  console.log(isServer());

  return (
    <Fragment>
      <Nav />
      <ul>
        {!data ? (
          <div>Cargando...</div>
        ) : (
          data.getPosts.map((post, i) => (
            <li key={post.id}>
              {i + 1} {post.title}
            </li>
          ))
        )}
      </ul>
    </Fragment>
  );
};

//activar server side rendering
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
