import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class createPostInput {
  @Field()
  title!: string;
}

@ArgsType()
export class updatePostInput {
  @Field()
  id!: string;

  @Field()
  title?: string;
}
