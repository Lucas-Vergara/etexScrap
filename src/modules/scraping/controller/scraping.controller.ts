import { Controller, Get } from '@nestjs/common';
import { ScrapingService } from '../services/scraping.service';
import * as puppeteer from 'puppeteer';


@Controller()
export class ScrapingController {

  constructor(private readonly scrapingService: ScrapingService) {}

  @Get('api/ejecutar-script')
  async runScrape() {
    const browser = await puppeteer.launch();
    try {
      await this.scrapingService.mainScrape();
    } catch (error) {
      console.error('Error en el scraping:', error);
    } finally {
      await browser.close();
    }
  }
}


//selenium
// async ejecutarScript(): Promise<string> {
//   return this.ejecutarSeleniumScript();
// }

// ejecutarSeleniumScript(): Promise<string> {
//   return new Promise((resolve, reject) => {
//     exec('python ../selenium/main.py', (error, stdout) => {
//       if (error) {
//         console.error(`Error al ejecutar el script: ${error.message}`);
//         reject(error.message);
//         return;
//       }
//       console.log(`Script ejecutado con éxito: ${stdout}`);
//       resolve(stdout);
//     });
//   });
// }