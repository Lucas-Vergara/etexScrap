import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../product/models/baseProduct.interface'

export default async function homecenterScrape(input: {
  products: BaseProduct[],
  date: Date;
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const day: string = input.date.getDate().toString()
  const month: string = (input.date.getMonth() + 1).toString()
  const year: string = (input.date.getFullYear()).toString()
  const date: string = `${day}-${month}-${year}`
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  const maxTries = 15;
  let currentTry = 0;

  for (const product of input.products) {
    // old scrape, with searchbar clicking
    // await page.goto('https://sodimac.falabella.com/sodimac-cl');
    // await page.type('#testId-SearchBar-Input', product.sku);
    // await page.click('.SearchBar-module_searchBtnIcon__2L2s0');
    currentTry = 0
    await page.goto(product.sku);
    while (currentTry < maxTries) {
      try {
        await page.waitForSelector('li[data-internet-price]');

        const price = await page.$eval('li[data-internet-price]', (element) => {
          return element.getAttribute('data-internet-price').replace('.', '');
        });

        const webTitle = await page.$eval('h1[data-name]', (element) => {
          return element.getAttribute('data-name');
        });

        const result = {
          day,
          month,
          year,
          date,
          category: product.category,
          region: product.region,
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
