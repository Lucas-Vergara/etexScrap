import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'base_products' })
export class BaseProduct extends Document {
  @Prop()
  _id: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  distributor: string;
}

export const BaseProductSchema = SchemaFactory.createForClass(BaseProduct);
