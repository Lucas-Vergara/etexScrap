import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingController } from '../scraping/scraping.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapDataModule } from './modules/scrapData/scrapData.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    ScrapDataModule,
    ProductModule,
  ],
  controllers: [AppController, ScrapingController],
  providers: [AppService],

})
export class AppModule {
  constructor() {
    console.log('MongoDB connected successfully');
  }
}
