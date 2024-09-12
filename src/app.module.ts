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
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
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
