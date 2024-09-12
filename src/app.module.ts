import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapDataModule } from './modules/scrapData/scrapData.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { ScrapingModule } from './modules/scraping/scraping.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ScreenshotModule } from './modules/screenshot/screenshot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://test:test@ac-qcmicej-shard-00-00.qyrybhz.mongodb.net:27017,ac-qcmicej-shard-00-01.qyrybhz.mongodb.net:27017,ac-qcmicej-shard-00-02.qyrybhz.mongodb.net:27017/test?replicaSet=atlas-cf0og1-shard-0&ssl=true&authSource=admin'),
    ScrapDataModule,
    ProductModule,
    ScrapingModule,
    ScreenshotModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
