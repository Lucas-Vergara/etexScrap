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

  async create(): Promise<ScrapingTracker> {
    const createdTracker = new this.scrapingTrackerModel({
      status: ScrapingServiceStatus.RUNNING,
      started: new Date(),
      completed: null,
      progress: null,
      initiator: null,
      errorMessage: null,
    });

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

  async findLastTracker(): Promise<ScrapingTracker | null> {
    return this.scrapingTrackerModel.findOne().sort({ _id: -1 }).exec();
  }

}
