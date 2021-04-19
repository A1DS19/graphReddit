import { getModelForClass, modelOptions, Prop } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class VotedPost {
  @Field(() => String)
  @Prop({ type: String, required: true })
  postId: string;

  @Field(() => Number)
  @Prop({ type: Number, required: true })
  voteValue: number;
}

@modelOptions({
  options: { customName: 'User' },
  schemaOptions: { timestamps: true },
})
@ObjectType()
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Field(() => [VotedPost])
  @Prop({ type: VotedPost, required: false, default: [] })
  votedPosts: VotedPost[];
}

export const UserModel = getModelForClass(User);
