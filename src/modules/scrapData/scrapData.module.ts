import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapDataController } from './controllers/scrapData.controller';
import { ScrapDataService } from './services/scrapData.service';
import { ScrapData, ScrapDataSchema } from './models/scrapData.model';

@Module({
  controllers: [ScrapDataController],
  providers: [ScrapDataService],
  imports: [MongooseModule.forFeature([{ name: ScrapData.name, schema: ScrapDataSchema }])],
})
export class ScrapDataModule {}
