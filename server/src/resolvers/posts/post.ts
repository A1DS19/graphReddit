import { MyContext } from '../../types';
import { Post } from '../../entities/Post';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { sleep } from '../../util/sleep';
import { createPostInput, updatePostInput } from './types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async getPosts(@Ctx() { em }: MyContext): Promise<Post[]> {
    //delay artificial
    await sleep(1000);
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  async getPost(
    @Arg('postId', () => String) postId: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return await em.findOne(Post, { id: postId });
  }

  @Mutation(() => Post)
  async createPost(
    @Args() input: createPostInput,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, input);
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Args() input: updatePostInput,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id: input.id });

    if (!post) {
      return null;
    }

    if (typeof input.title !== 'undefined') {
      post.title = input.title;
      em.persistAndFlush(post);
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('postId') postId: string,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    try {
      await em.nativeDelete(Post, { id: postId });
      return true;
    } catch (err) {
      return false;
    }
  }
}
