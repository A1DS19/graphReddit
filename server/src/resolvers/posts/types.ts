import { Post } from '../../models/Post';
import { Field, InputType, ObjectType } from 'type-graphql';

@InputType()
export class createPostInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  text!: string;
}

@InputType()
export class updatePostInput {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  text?: string;
}

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Boolean)
  hasMore: boolean;
}
