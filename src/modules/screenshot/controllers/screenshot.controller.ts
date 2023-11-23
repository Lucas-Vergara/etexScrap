import { Controller, Get, Param, Post } from '@nestjs/common';
import { ScreenshotService } from '../services/screenshot.service';
import { Screenshot } from '../models/screenshot.model';

@Controller('screenshots')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Get()
  async findAll(): Promise<Screenshot[]> {
    return this.screenshotService.findAll();
  }

  @Get('run_script')
  async captureAllBaseProductsScreenshots(): Promise<Screenshot[]> {
    return this.screenshotService.captureScreenshotsForAllBaseProducts();
  }

  @Post(':url')
  async captureScreenshot(@Param('url') url: string): Promise<Screenshot> {
    return this.screenshotService.captureScreenshot(url);
  }
}
