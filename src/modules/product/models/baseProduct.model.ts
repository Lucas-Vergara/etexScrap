import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'base_products' })
export class BaseProduct extends Document {

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  distributor: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  region: string;
}

export const BaseProductSchema = SchemaFactory.createForClass(BaseProduct);
