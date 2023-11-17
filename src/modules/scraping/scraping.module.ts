import { Module } from '@nestjs/common';
import { ScrapingController } from './controllers/scraping.controller';
import { ScrapingService } from './services/scraping.service';
import { BaseProductService } from 'src/modules/baseProduct/services/baseProduct.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseProduct, BaseProductSchema } from '../baseProduct/models/baseProduct.model';
import { ProductService } from '../product/services/product.service';
import { Product, ProductSchema } from '../product/models/product.model';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapingTracker, ScrapingTrackerSchema } from './models/scrapingTracker.model';
import { ScrapingTrackerService } from './services/scrapingTracker.service';

@Module({
  controllers: [ScrapingController],
  providers: [ScrapingService, BaseProductService, ProductService, ScrapingTrackerService],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: BaseProduct.name, schema: BaseProductSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: ScrapingTracker.name, schema: ScrapingTrackerSchema }]),
  ],
})
export class ScrapingModule {}
