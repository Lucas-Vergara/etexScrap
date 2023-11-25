import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapingTracker, ScrapingServiceStatus } from '../models/scrapingTracker.model';

@Injectable()
export class ScrapingTrackerService {
  constructor(
    @InjectModel(ScrapingTracker.name)
    private readonly scrapingTrackerModel: Model<ScrapingTracker>,
  ) {}

  async create(options?: Partial<ScrapingTracker>): Promise<ScrapingTracker> {

    const defaultValues = new this.scrapingTrackerModel({
      status: ScrapingServiceStatus.RUNNING,
      started: new Date(),
      completed: null,
      progress: null,
      initiator: null,
      errorMessage: null,
    });

    const trackerData = { ...defaultValues, ...options };
    const createdTracker = new this.scrapingTrackerModel(trackerData);

    return createdTracker.save();
  }

  async findById(id: number): Promise<ScrapingTracker> {
    return this.scrapingTrackerModel.findById(id).exec();
  }

  async update(id, updates: {}): Promise<ScrapingTracker> {
    return this.scrapingTrackerModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );
  }

  async pushToMissingProducts(id, newProduct: { product: string, product_url: string }): Promise<ScrapingTracker> {
    return this.scrapingTrackerModel.findByIdAndUpdate(
      id,
      { $push: { missingProducts: newProduct } },
      { new: true },
    );
  }

  async findLastTracker(): Promise<ScrapingTracker | null> {
    return this.scrapingTrackerModel.findOne().sort({ _id: -1 }).exec();
  }

  async getRecentMissingProducts(): Promise<{ _id: string, missingProducts: any[] }[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTrackers = await this.scrapingTrackerModel
      .find({ started: { $gte: thirtyDaysAgo } })
      .exec();

    const result = recentTrackers.reduce((acc, { missingProducts }) => {
      return acc.concat(missingProducts);
    }, []);

    return result;
  }


}
