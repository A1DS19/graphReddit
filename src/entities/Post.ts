import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Post {
  @PrimaryKey({ type: ObjectId })
  _id: ObjectId;

  @Property({ type: String })
  title!: string;

  @Property({ type: Date })
  createdAt = new Date();

  @Property({ type: String, onUpdate: () => new Date() })
  updatedAt = new Date();

  //uso virtual
  //no es guardado en DB
  @SerializedPrimaryKey({ type: String })
  id!: string;
}
