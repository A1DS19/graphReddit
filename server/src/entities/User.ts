import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  @PrimaryKey({ type: ObjectId })
  _id: ObjectId;

  @Field(() => String)
  @Property({ type: String, unique: true })
  email!: string;

  @Property({ type: String })
  password!: string;

  @Field(() => String)
  @Property({ type: Date })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: Date, onUpdate: () => new Date() })
  updatedAt = new Date();

  //uso virtual
  //no es guardado en DB
  @Field(() => String)
  @SerializedPrimaryKey({ type: String })
  id!: string;
}
