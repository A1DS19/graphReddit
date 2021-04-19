import { getModelForClass, modelOptions, Prop, Ref } from '@typegoose/typegoose';
import { Field, Int, ObjectType } from 'type-graphql';
import { User } from './User';

@modelOptions({
  options: { customName: 'Post' },
  schemaOptions: { timestamps: true },
})
@ObjectType()
export class Post {
  @Field(() => String)
  _id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  @Prop({ type: String, required: true })
  title: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  text: string;

  @Field(() => Int)
  @Prop({ type: Number, required: false, default: 0 })
  points: number;

  @Field(() => User)
  @Prop({ ref: User, required: true })
  creator: Ref<User>;
}

export const PostModel = getModelForClass(Post);
