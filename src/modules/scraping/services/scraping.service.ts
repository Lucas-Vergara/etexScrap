import { Injectable } from '@nestjs/common';
import { BaseProductService } from 'src/modules/baseProduct/services/baseProduct.service';
import { BaseProduct } from 'src/modules/baseProduct/models/baseProduct.interface';
import homecenterScrape from '../distributors/homecenterScrape';
import { ProductService } from 'src/modules/product/services/product.service';
import yolitoScrape from '../distributors/yolitoScrape';
import ferrobalScrape from '../distributors/ferrobalScrape';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class ScrapingService {
  constructor(
    private readonly baseProductService: BaseProductService,
    private readonly productService: ProductService,
  ) {}

  @Cron('0 2 * * *', { timeZone: 'America/Santiago' })
  async handleScraping() {
    await this.mainScrape();
  }

  async mainScrape() {
    try {
      const products = await this.baseProductService.findAll();
      const date = new Date()
      const yolitoProducts = filterProductsByDistributor(products, 'Yolito')
      const sodimanProducts = filterProductsByDistributor(products, 'Sodimac (RM)')
      const ferrobalProducts = filterProductsByDistributor(products, 'Ferrobal')

      let results = await homecenterScrape({
        products: sodimanProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await yolitoScrape({
        products: yolitoProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await ferrobalScrape({
        products: ferrobalProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

    } catch (error) {
      console.log(error);
    }
  }
}


//functions
function filterProductsByDistributor(products: BaseProduct[], targetDistributor: string): BaseProduct[] {
  return products.filter((product) => product.distributor === targetDistributor);
}
