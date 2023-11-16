import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../baseProduct/models/baseProduct.interface'

export default async function homecenterScrape(input: {
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
    await page.goto(product.sku);
    // old scrape, with searchbar clicking
    // await page.goto('https://sodimac.falabella.com/sodimac-cl');
    // await page.type('#testId-SearchBar-Input', product.sku);
    // await page.click('.SearchBar-module_searchBtnIcon__2L2s0');

    try {
      await page.waitForSelector('li[data-internet-price]');

      const price = await page.$eval('li[data-internet-price]', (element) => {
        return element.getAttribute('data-internet-price').replace('.', '');
      });

      const webTitle = await page.$eval('h1[data-name]', (element) => {
        return element.getAttribute('data-name');
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
        price: parseInt(price),
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
