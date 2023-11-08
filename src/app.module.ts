import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingController } from '../scraping/scraping.controller';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from 'config/database.config';
import { ScrapDataModule } from './modules/scrapData/scrapData.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    ScrapDataModule,
    ProductModule
  ],
  controllers: [AppController, ScrapingController],
  providers: [AppService],

})
export class AppModule {
  constructor() {
    console.log('MongoDB connected successfully');
  }
}
