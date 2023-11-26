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

  async dailyMissingProducts(): Promise<{ _id: string, missingProducts: any[] }[]> {
    const currentDateTime = new Date();
    const offsetMinutes = currentDateTime.getTimezoneOffset();

    const localStartOfDay = new Date(currentDateTime);
    localStartOfDay.setHours(0 - offsetMinutes / 60, 0, 0, 0);

    const localEndOfDay = new Date(currentDateTime);
    localEndOfDay.setHours(23 - offsetMinutes / 60, 59, 59, 999);

    const trackers = await this.scrapingTrackerModel
      .find({ started: { $gte: localStartOfDay, $lte: localEndOfDay } })
      .exec();

    const commonMissingProducts: any[] = [];

    // Si hay al menos un tracker con missingProducts
    if (trackers.length > 0 && trackers[0].missingProducts.length > 0) {
      // Verificar si todos los trackers comparten el mismo missingProduct
      const firstTrackerMissingProducts = new Set(trackers[0].missingProducts.map(product => `${product.product}-${product.product_url}`));

      for (let i = 1; i < trackers.length; i++) {
        const currentTrackerMissingProducts = new Set(trackers[i].missingProducts.map(product => `${product.product}-${product.product_url}`));

        // Intersectar los missingProducts del tracker actual con los del primer tracker
        const commonProducts = [...firstTrackerMissingProducts].filter(product => currentTrackerMissingProducts.has(product));

        // Si no hay productos comunes, salir del bucle
        if (commonProducts.length === 0) {
          break;
        }

        // Si es el último tracker y hay productos comunes, agregarlos a commonMissingProducts
        if (i === trackers.length - 1) {
          commonProducts.forEach(productKey => {
            const [product, product_url] = productKey.split('-');
            commonMissingProducts.push({ product, product_url });
          });
        }
      }
    }

    return commonMissingProducts;

    return trackers;
  }

  async monthlyMissingProducts(): Promise<{ day: string, missingProducts: any[] }[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyTrackers = await this.scrapingTrackerModel
      .find({ started: { $gte: thirtyDaysAgo } })
      .exec();

    // Mapear y agrupar los trackers por día
    const groupedTrackers = monthlyTrackers.reduce((acc, tracker) => {
      const dayKey = tracker.started.toISOString().split('T')[0]; // Obtener la fecha como clave
      acc[dayKey] = acc[dayKey] || [];
      acc[dayKey].push(tracker);
      return acc;
    }, {});

    const result: { day: string, missingProducts: any[] }[] = [];

    for (const dayKey in groupedTrackers) {
      const dayTrackers = groupedTrackers[dayKey];

      // Si hay al menos un tracker con missingProducts
      if (dayTrackers.length > 0 && dayTrackers[0].missingProducts.length > 0) {
        // Verificar si todos los trackers del día comparten el mismo missingProduct
        const firstTrackerMissingProducts = new Set(dayTrackers[0].missingProducts.map(product => `${product.product}-${product.product_url}`));

        let allTrackersHaveCommonProducts = true;

        for (let i = 1; i < dayTrackers.length; i++) {
          const currentTrackerMissingProducts = new Set(dayTrackers[i].missingProducts.map(product => `${product.product}-${product.product_url}`));

          // Intersectar los missingProducts del tracker actual con los del primer tracker
          const commonProducts = [...firstTrackerMissingProducts].filter(product => currentTrackerMissingProducts.has(product));

          // Si no hay productos comunes, indicar que no todos los trackers tienen productos comunes
          if (commonProducts.length === 0) {
            allTrackersHaveCommonProducts = false;
            break;
          }
        }

        // Si todos los trackers del día tienen productos comunes, agregarlos a result
        if (allTrackersHaveCommonProducts) {
          result.push({ day: dayKey, missingProducts: dayTrackers[0].missingProducts });
        }
      }
    }

    return result;
  }



}
