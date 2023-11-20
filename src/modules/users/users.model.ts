import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({ collection: 'users' })
export class User extends Document {

  @Prop({ required: true })
  email: String;

  @Prop({ required: true })
  password: String

}

export const UserSchema = SchemaFactory.createForClass(User);