import { Post, PostModel } from '../../models/Post';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
} from 'type-graphql';
import { createPostInput, PaginatedPosts, updatePostInput } from './types';
import { MyContext } from 'src/types';
import { isAuth } from '../../middleware/isAuth';
import { FilterQuery } from 'mongoose';
import { DocumentType, post } from '@typegoose/typegoose';
import { sleep } from '../..//util/sleep';
import { User, UserModel, VotedPost } from '../../models/User';

@Resolver(Post)
export class PostResolver {
  //Se usa como snippet o preview de algo
  //grande en este caso text va a agregar espacio
  //a gql schema y agregar textSnippet donde devolvera
  //el text a 50 chars.
  @FieldResolver(() => String)
  //no tengo idea porque no puedo usar Post type en root
  textSnippet(@Root() root: any) {
    return root.text.slice(0, 50);
  }

  @Query(() => PaginatedPosts)
  async getPosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Date, { nullable: true }) cursor: Date | null
  ): Promise<PaginatedPosts> {
    //delay artificial
    //await sleep(1000);

    //El limite maximo es 50 aunque se pase 100 por parametros
    //se mantiene este limite
    const realLimit = Math.min(50, limit);
    const realLimitHasMore = realLimit + 1;

    let filter: FilterQuery<DocumentType<Post>> = {};
    if (cursor) {
      filter = { createdAt: { $lt: cursor } };
    }

    const posts = await PostModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(realLimitHasMore)
      .populate('creator');

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitHasMore,
    };
  }

  @Query(() => Post, { nullable: true })
  async getPost(@Arg('postId', () => String) postId: string): Promise<Post | null> {
    return await PostModel.findById(postId);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: createPostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const post = new PostModel({ ...input, creator: req.session.userId });
    await post.save();
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(@Arg('input') input: updatePostInput): Promise<Post | null> {
    const post = await PostModel.findById(input.id);

    if (!post) {
      return null;
    }

    if (typeof input.title !== 'undefined') {
      post.title = input.title;
      await post.save();
    }

    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg('postId') postId: string): Promise<Boolean> {
    try {
      await PostModel.deleteOne({ _id: postId });
      return true;
    } catch (err) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Ctx() { req }: MyContext,
    @Arg('postId') postId: string,
    @Arg('value') value: number
  ): Promise<Boolean> {
    try {
      const isUpvote = value !== -1;
      const user = await UserModel.findById(req.session.userId);
      const userVotedPost = user?.votedPosts.filter((post) => post.postId === postId);
      const objUserVote: VotedPost = {
        postId: postId,
        voteValue: value,
      };

      if (userVotedPost![0]) {
        await UserModel.findByIdAndUpdate(req.session.userId, {
          $pull: { votedPosts: { postId: objUserVote.postId } },
        });

        await UserModel.findByIdAndUpdate(req.session.userId, {
          $push: { votedPosts: objUserVote },
        });

        if (userVotedPost![0].voteValue !== value) {
          await PostModel.findByIdAndUpdate(
            postId,
            isUpvote ? { $inc: { points: 1 } } : { $inc: { points: -1 } }
          );
        }
        return true;
      }

      await UserModel.findByIdAndUpdate(req.session.userId, {
        $push: { votedPosts: objUserVote },
      });

      await PostModel.findByIdAndUpdate(
        postId,
        isUpvote ? { $inc: { points: 1 } } : { $inc: { points: -1 } }
      );
      return true;
    } catch (err) {
      console.error(err.message);
      return false;
    }
  }
}
