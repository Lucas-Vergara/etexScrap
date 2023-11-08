import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapData } from '../models/scrapData.model';

@Injectable()
export class ScrapDataService {
  constructor(@InjectModel(ScrapData.name) private readonly scrapDataModel: Model<ScrapData>) {}

  async findAll(): Promise<ScrapData[]> {
    try {
      const collectionName = this.scrapDataModel.collection.name;
      const dbName = this.scrapDataModel.db.name;

      console.log('Accessing collection:', collectionName, 'in database:', dbName);

      const result = await this.scrapDataModel.find().exec();
      console.log('Result from ScrapDataService findAll:', result);
      return result;
    } catch (error) {
      console.error('Error in ScrapDataService findAll:', error);
      throw error;
    }
  }
}
