import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../baseProduct/models/baseProduct.interface'

export default async function construplazaScrape(input: {
  products: BaseProduct[],
  date: Date;
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const date = input.date
  const day: string = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  for (const product of input.products) {
    try {
      await page.goto(product.sku);

      const price = await page.$eval('span.price', (element) => {
        return element.textContent;
      });

      const webTitle = await page.$eval('div.name', (element) => {
        return element.textContent;
      });


      const result = {
        datetime: date,
        date: day,
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
