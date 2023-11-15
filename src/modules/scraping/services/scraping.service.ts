import { Injectable } from '@nestjs/common';
import { BaseProductService } from 'src/modules/baseProduct/services/baseProduct.service';
import { BaseProduct } from 'src/modules/baseProduct/models/baseProduct.interface';
import homecenterScrape from '../distributors/homecenterScrape';
import { ProductService } from 'src/modules/product/services/product.service';
import yolitoScrape from '../distributors/yolitoScrape';
import ferrobalScrape from '../distributors/ferrobalScrape';
import { Cron, CronExpression } from '@nestjs/schedule';
import construmartScrape from '../distributors/construmart';
import construplazaScrape from '../distributors/construplaza';
import easyScrape from '../distributors/easy';
import imperialScrape from '../distributors/imperial';
import tosoScrape from '../distributors/toso';
import weitzlerScrape from '../distributors/weitzler';
import prodalamScrape from '../distributors/prodalam';


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

      results = await construmartScrape({
        products: construmartProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await construplazaScrape({
        products: construplazaProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await easyScrape({
        products: easyProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await imperialScrape({
        products: imperialProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await prodalamScrape({
        products: prodalamProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await tosoScrape({
        products: tosoProducts,
        date: date,
      });
      for (const result of results) {
        await this.productService.createOrUpdate(result);
      }

      results = await weitzlerScrape({
        products: weitzlerProducts,
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
