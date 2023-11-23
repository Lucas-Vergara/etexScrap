import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScreenshotService } from './services/screenshot.service';
import { Screenshot, ScreenshotSchema } from './models/screenshot.model';
import { BaseProductSchema } from '../product/models/baseProduct.model';
import { ScreenshotController } from './controllers/screenshot.controller';

@Module({
  controllers: [ScreenshotController],
  imports: [
    MongooseModule.forFeature([
      { name: Screenshot.name, schema: ScreenshotSchema },
      { name: 'BaseProduct', schema: BaseProductSchema },
    ]),
  ],
  providers: [ScreenshotService],
  exports: [ScreenshotService], // Exporta el servicio si planeas usarlo fuera de este módulo
})
export class ScreenshotModule {}
