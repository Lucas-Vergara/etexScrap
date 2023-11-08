import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ScrapingController } from '../scraping/scraping.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const tuController = app.get(ScrapingController);
  await tuController.ejecutarSeleniumScript();
  await app.close();
}

bootstrap();
