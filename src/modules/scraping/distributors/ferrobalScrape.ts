import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../baseProduct/models/baseProduct.interface'

export default async function ferrobalScrape(input: {
  products: BaseProduct[],
  date: Date;
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: false });
  const results: any[] = [];
  const date = input.date
  const day: string = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  const page = await browser.newPage();

  for (const product of input.products) {
    try {
      await page.goto(product.sku);
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
    } catch (error) {
      const result = {
        datetime: input.date,
        date: day,
        name: product.name,
        brand: product.brand,
        distributor: product.distributor,
        web_title: null,
        sku: product.sku,
        presence: true,
        price: null,
      };
      console.log(result)
      console.error(error);
    }
  }
  await browser.close();
  return results;
}
