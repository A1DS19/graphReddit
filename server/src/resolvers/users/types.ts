import { InputType, Field, ObjectType } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  id!: string;

  @Field()
  email?: string;

  @Field()
  password?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  token!: string;

  @Field()
  newPassword!: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  msg: string;
}
