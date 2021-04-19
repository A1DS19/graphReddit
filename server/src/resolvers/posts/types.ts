import { Post } from '../../models/Post';
import { Field, InputType, ObjectType } from 'type-graphql';

@InputType()
export class createPostInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

@InputType()
export class updatePostInput {
  @Field()
  id!: string;

  @Field()
  title?: string;
}

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Boolean)
  hasMore: boolean;
}
