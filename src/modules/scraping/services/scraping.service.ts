import { Injectable } from '@nestjs/common';
import { BaseProductService } from 'src/modules/product/services/baseProduct.service';
import { BaseProduct } from 'src/modules/product/models/baseProduct.interface';
import homecenterScrape from '../distributors/homecenter';
import { ProductService } from 'src/modules/product/services/product.service';
import yolitoScrape from '../distributors/yolito';
import ferrobalScrape from '../distributors/ferrobal';
import { Cron, CronExpression } from '@nestjs/schedule';
import construmartScrape from '../distributors/construmart';
import construplazaScrape from '../distributors/construplaza';
import easyScrape from '../distributors/easy';
import imperialScrape from '../distributors/imperial';
import tosoScrape from '../distributors/toso';
import weitzlerScrape from '../distributors/weitzler';
import prodalamScrape from '../distributors/prodalam';
import { ScrapingServiceStatus, ScrapingTracker } from '../models/scrapingTracker.model';
import { ScrapingTrackerService } from './scrapingTracker.service';


@Injectable()
export class ScrapingService {
  constructor(
    private readonly baseProductService: BaseProductService,
    private readonly productService: ProductService,
    private readonly scrapingTrackerService: ScrapingTrackerService,
  ) {}

  @Cron('0 2 * * *', { timeZone: 'America/Santiago' })
  async handleScraping() {
    const tracker = await this.scrapingTrackerService.create({ initiator: 'Servidor', started: new Date() });
    await this.mainScrape(tracker);
  }

  async mainScrape(tracker: ScrapingTracker) {
    try {
      const products = await this.baseProductService.findAll();
      const date = new Date()
      const sodimanProducts = filterProductsByDistributor(products, 'Sodimac')
      const yolitoProducts = filterProductsByDistributor(products, 'Yolito')
      const ferrobalProducts = filterProductsByDistributor(products, 'Ferrobal')
      const construmartProducts = filterProductsByDistributor(products, 'Construmart')
      const construplazaProducts = filterProductsByDistributor(products, 'Construplaza')
      const easyProducts = filterProductsByDistributor(products, 'Easy')
      const imperialProducts = filterProductsByDistributor(products, 'Imperial')
      const tosoProducts = filterProductsByDistributor(products, 'Toso')
      const weitzlerProducts = filterProductsByDistributor(products, 'Weitzler')
      const prodalamProducts = filterProductsByDistributor(products, 'Prodalam')

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Construmart' });
      let results = await construmartScrape({
        products: construmartProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Construplaza' });
      results = await construplazaScrape({
        products: construplazaProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Easy' });
      results = await easyScrape({
        products: easyProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Ferrobal' });
      results = await ferrobalScrape({
        products: ferrobalProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Homecenter' });
      results = await homecenterScrape({
        products: sodimanProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Imperial' });
      results = await imperialScrape({
        products: imperialProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Prodalam' });
      results = await prodalamScrape({
        products: prodalamProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Toso' });
      results = await tosoScrape({
        products: tosoProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Weitzler' });
      results = await weitzlerScrape({
        products: weitzlerProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      await this.scrapingTrackerService.update(tracker._id, { progress: 'Yolito' });
      results = await yolitoScrape({
        products: yolitoProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      const updates = {
        status: ScrapingServiceStatus.COMPLETED,
        completed: new Date,
        progress: 'finished'
      }
      await this.scrapingTrackerService.update(tracker._id, updates);
    } catch (error) {
      await this.scrapingTrackerService.update(tracker._id, { errorMessage: error });
      console.log(error);
    }
  }
}


//functions
function filterProductsByDistributor(products: BaseProduct[], targetDistributor: string): BaseProduct[] {
  return products.filter((product) => product.distributor === targetDistributor);
}
