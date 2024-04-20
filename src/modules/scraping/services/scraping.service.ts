import { Injectable } from '@nestjs/common';
import { BaseProductService } from 'src/modules/product/services/baseProduct.service';
import { BaseProduct } from 'src/modules/product/models/baseProduct.interface';
import { ProductService } from 'src/modules/product/services/product.service';
import { Cron } from '@nestjs/schedule';
import { ScrapingServiceStatus, ScrapingTracker } from '../models/scrapingTracker.model';
import { ScrapingTrackerService } from './scrapingTracker.service';
import dynamicScrape from './dynamicScrape';


@Injectable()
export class ScrapingService {
  constructor(
    private readonly baseProductService: BaseProductService,
    private readonly productService: ProductService,
    private readonly scrapingTrackerService: ScrapingTrackerService,
  ) {}

  @Cron('0 1,6,21 * * *', { timeZone: 'America/Santiago' })
  async handleScraping() {
    const tracker = await this.scrapingTrackerService.create({ initiator: 'Servidor', started: new Date() });
    await this.mainScrape(tracker);
  }

  async mainScrape(tracker: ScrapingTracker) {
    try {
      const products = await this.baseProductService.findAll();
      const date = new Date()
      let productsAmount = 0;

      const distributors = [
        // { name: 'Construmart', products: filterProductsByDistributor(products, 'Construmart'), priceSelector: '.vtex-product-price-1-x-sellingPriceValue', titleSelector: '.vtex-store-components-3-x-productBrand' },
        // { name: 'Construplaza', products: filterProductsByDistributor(products, 'Construplaza'), priceSelector: 'span.price', titleSelector: 'div.name' },
        // { name: 'Easy', products: filterProductsByDistributor(products, 'Easy'), priceSelector: 'div.easycl-precio-cencosud-0-x-lastPrice', titleSelector: 'span.vtex-store-components-3-x-productBrand' },
        // { name: 'Ferrobal', products: filterProductsByDistributor(products, 'Ferrobal'), priceSelector: '', titleSelector: '', },
        // { name: 'Homecenter', products: filterProductsByDistributor(products, 'Sodimac'), priceSelector: '', titleSelector: '' },
        // { name: 'Imperial', products: filterProductsByDistributor(products, 'Imperial'), priceSelector: '#root > main > section:nth-child(2) > div > div > section > div.osf__sc-d9hb4p-0.osf__sc-ezuj69-0.jRBkAY.hrAxGa > div > div.osf__sc-d9hb4p-0.osf__sc-1wibf4t-0.osf__sc-1kvhwj2-0.lnkVmY.hzGYQn.lfmKWP > div > p', titleSelector: '#root > main > section:nth-child(2) > div > div > section > div.osf__sc-d9hb4p-0.osf__sc-ezuj69-0.jRBkAY.hrAxGa > div > div.osf__sc-d9hb4p-0.osf__sc-1wibf4t-0.osf__sc-7hvb28-0.jRBkAY.hzGYQn.cowjsN > h2 > span' },
        // { name: 'Prodalam', products: filterProductsByDistributor(products, 'Prodalam'), priceSelector: 'span#gtm_price', titleSelector: 'div.detail__title' },
        // { name: 'Toso', products: filterProductsByDistributor(products, 'Toso'), priceSelector: '', titleSelector: '' },
        { name: 'Weitzler', products: filterProductsByDistributor(products, 'Weitzler'), priceSelector: 'p.price.product-page-price', titleSelector: 'h1.product-title.product_title.entry-title' },
        // { name: 'Yolito', products: filterProductsByDistributor(products, 'Yolito'), priceSelector: '', titleSelector: '' },
      ];

      for (const distributor of distributors) {
        await this.scrapingTrackerService.update(tracker._id, { progress: distributor.name });

        const results = await dynamicScrape({
          products: distributor.products,
          date,
          tracker,
          scrapingTrackerService: this.scrapingTrackerService,
          priceSelector: distributor.priceSelector,
          titleSelector: distributor.titleSelector,
        });

        for (const result of results) {
          await this.productService.createOrUpdate(result);
        }
        productsAmount += results.length;
      }

      const updates = {
        status: ScrapingServiceStatus.COMPLETED,
        completed: new Date,
        progress: 'finished',
        productsAmount
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
