// scrap-data.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ScrapDataItem } from '../scrapDataTypes';


@Schema({ collection: 'scrapData' })
export class ScrapData extends Document {

  @Prop()
  _id: string;

  @Prop({ required: true })
  date: string;

  @Prop({
    type: [
      {
        distributor: String,
        web: String,
        SKU: String,
        presente: Boolean,
        precio: String,
        descripcion_inicial: String,
        descripcion_web: String,
      },
    ],
  })
  homecenter: ScrapDataItem[];

  @Prop({
    type: [
      {
        distributor: String,
        web: String,
        SKU: String,
        presente: Boolean,
        precio: String,
        descripcion_inicial: String,
        descripcion_web: String,
      },
    ],
  })
  yolito: ScrapDataItem[];

  @Prop({
    type: [
      {
        distributor: String,
        web: String,
        SKU: String,
        presente: Boolean,
        precio: String,
        descripcion_inicial: String,
        descripcion_web: String,
      },
    ],
  })
  ferrobal: ScrapDataItem[];

}

export const ScrapDataSchema = SchemaFactory.createForClass(ScrapData);
