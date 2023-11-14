import { Module } from '@nestjs/common';
import { ScrapingController } from './controller/scraping.controller';
import { ScrapingService } from './services/scraping.service';
import { BaseProductService } from 'src/modules/baseProduct/services/baseProduct.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseProduct, BaseProductSchema } from '../baseProduct/models/baseProduct.model';
import { ProductService } from '../product/services/product.service';
import { Product, ProductSchema } from '../product/models/product.model';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [ScrapingController],
  providers: [ScrapingService, BaseProductService, ProductService],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: BaseProduct.name, schema: BaseProductSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
  ],
})
export class ScrapingModule {}
