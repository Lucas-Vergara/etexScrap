import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Screenshot } from '../models/screenshot.model'; // Asegúrate de importar el modelo de Screenshot
import { BaseProduct } from 'src/modules/product/models/baseProduct.model';

@Injectable()
export class ScreenshotService {
  constructor(
    @InjectModel('Screenshot') private readonly screenshotModel: Model<Screenshot>,
    @InjectModel('BaseProduct') private readonly baseProductModel: Model<BaseProduct>,
  ) {}

  async findAll(): Promise<Screenshot[]> {
    return this.screenshotModel.find().exec();
  }

  async captureScreenshotsForAllBaseProducts(): Promise<Screenshot[]> {
    const baseProducts = await this.baseProductModel.find().exec();
    const screenshots: Screenshot[] = [];

    for (const baseProduct of baseProducts) {
      console.log(baseProduct.sku);

      const url = baseProduct.sku;
      const screenshot = await this.captureScreenshot(url);
      screenshots.push(screenshot);
    }

    return screenshots;
  }

  async captureScreenshot(url: string): Promise<Screenshot> {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 10 });
    await browser.close();

    // Guardar la captura en la base de datos
    const newScreenshot = new this.screenshotModel({
      url,
      image: screenshotBuffer,
    });

    return newScreenshot.save();
  }
}
