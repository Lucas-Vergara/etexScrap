import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../product/models/baseProduct.interface'
import { ScrapingTracker } from '../models/scrapingTracker.model';
import { ScrapingTrackerService } from '../services/scrapingTracker.service';

export default async function tosoScrape(input: {
  products: BaseProduct[],
  date: Date,
  tracker: ScrapingTracker,
  scrapingTrackerService: ScrapingTrackerService
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const day: string = input.date.getDate().toString()
  const month: string = (input.date.getMonth() + 1).toString()
  const year: string = (input.date.getFullYear()).toString()
  const date: string = `${day}-${month}-${year}`
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  let maxTries = 10;
  if (input.products.length === 1) maxTries = 1; //for creating or editing products
  let currentTry = 0;

  for (const product of input.products) {
    currentTry = 0
    await page.goto(product.sku);
    while (currentTry < maxTries) {
      try {
        await page.waitForSelector('span.woocommerce-Price-amount bdi', { timeout: 10000 });

        let price;
        try {
          price = await page.$eval('ins span.woocommerce-Price-amount bdi', (element) => {
            return element.textContent;
          });
        } catch (error) {
          price = await page.$eval('span.woocommerce-Price-amount bdi', (element) => {
            return element.textContent;
          });
        }

        const webTitle = await page.$eval('h1.product_title.entry-title', (element) => {
          return element.textContent;
        });
        const result = {
          day,
          month,
          year,
          date,
          category: product.category,
          format: product.format,
          region: product.region,
          name: product.name,
          brand: product.brand,
          distributor: product.distributor,
          web_title: webTitle.trim().replace(/\\n/g, ''),
          sku: product.sku,
          presence: true,
          price: parseInt(price.replace(/[^\d]/g, '')),
        };

        results.push(result);
        console.log(result);
        break;
      } catch (error) {
        if (currentTry + 1 === maxTries) {
          await input.scrapingTrackerService.pushToMissingProducts(
            input.tracker._id,
            { product: `${product.name} | ${product.brand} | ${product.distributor}`, product_url: product.sku }
          );
        }
        currentTry++;
        console.error(error);
        console.log(currentTry);
        console.log(product.name);
      }
    }
  }
  await browser.close();
  return results;
}
