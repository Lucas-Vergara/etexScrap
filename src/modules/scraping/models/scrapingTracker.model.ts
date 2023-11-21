import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ScrapingServiceStatus {
  RUNNING = 'running',
  COMPLETED = 'completed',
  ERROR = 'error',
}

@Schema({ collection: 'scraping_trackers' })
export class ScrapingTracker extends Document {

  @Prop({ default: ScrapingServiceStatus.RUNNING })
  status: ScrapingServiceStatus;

  @Prop({ default: null })
  started: Date;

  @Prop({ default: null })
  completed: Date;

  @Prop({ default: null })
  progress: string;

  @Prop({ default: null })
  initiator: string;

  @Prop({ default: null })
  errorMessage: string;

  @Prop({ default: null })
  missingProducts: { product: string; product_url: string }[]

  @Prop({ default: null })
  productsAmount: number;

}

export const ScrapingTrackerSchema = SchemaFactory.createForClass(ScrapingTracker);
