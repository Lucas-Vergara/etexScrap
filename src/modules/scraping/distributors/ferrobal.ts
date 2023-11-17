import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../product/models/baseProduct.interface'

export default async function ferrobalScrape(input: {
  products: BaseProduct[],
  date: Date;
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const date = input.date
  const day: string = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  const maxTries = 15;
  let currentTry = 0;


  for (const product of input.products) {
    currentTry = 0
    await page.goto(product.sku);
    while (currentTry < maxTries) {
      try {
        const priceElement = await page.$('[name="twitter:data1"]');
        const price = parseInt(
          (await priceElement?.evaluate((element) => element.getAttribute('content')))?.replace(".", "").replace("$", "") || '0',
          10
        );
        const nameElement = await page.$('.entry-title');
        const webTitle = await nameElement?.evaluate((element) => element.textContent);

        const result = {
          datetime: date,
          date: day,
          name: product.name,
          brand: product.brand,
          distributor: product.distributor,
          web_title: webTitle,
          sku: product.sku,
          presence: true,
          price: price,
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
