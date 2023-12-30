import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({ collection: 'products' })
export class Product extends Document {

  @Prop({ required: true })
  date: String;

  @Prop({ required: true })
  day: String

  @Prop({ required: true })
  month: String

  @Prop({ required: true })
  year: String

  @Prop({ required: true })
  name: String;

  @Prop({ required: true })
  brand: String;

  @Prop({ required: true })
  web_title: String;

  @Prop({ required: true })
  distributor: String;

  @Prop({ required: true })
  sku: String;

  @Prop({ required: true })
  presence: Boolean;

  @Prop({ required: true })
  price: Number;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  format: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);