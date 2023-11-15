import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../baseProduct/models/baseProduct.interface'

export default async function construmartScrape(input: {
  products: BaseProduct[],
  date: Date;
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const date = input.date
  const day: string = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  const page = await browser.newPage();
  // await page.goto('https://www.construmart.cl/');
  // await page.select('select#region', 'XIII REGIÓN METROPOLITANA DE SANTIAGO');
  // await page.click('button.storeSelectorButton');
  const maxTries = 15;
  let currentTry = 0;

  for (const product of input.products) {
    currentTry = 0
    while (currentTry < maxTries) {
      try {
        await page.goto(product.sku);
        await page.waitForSelector('.vtex-product-price-1-x-sellingPriceValue', { timeout: 5000 });

        const price = await page.$eval('.vtex-product-price-1-x-sellingPriceValue', (element) => {
          return element.textContent.trim();
        });

        const webTitle = await page.$eval('.vtex-store-components-3-x-productBrand', (element) => {
          return element.textContent.trim();
        });

        const result = {
          datetime: date,
          date: day,
          name: product.name,
          brand: product.brand,
          distributor: product.distributor,
          web_title: webTitle,
          sku: product.sku,
          presence: true,
          price: parseInt(price.replace(/[^\d]/g, '')),
        };

        results.push(result);
        console.log(result);
        break;
      } catch (error) {
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
