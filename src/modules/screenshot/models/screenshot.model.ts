import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'screenshots' })
export class Screenshot extends Document {

  @Prop()
  url: String;

  @Prop()
  image: Buffer;


}

export const ScreenshotSchema = SchemaFactory.createForClass(Screenshot);
