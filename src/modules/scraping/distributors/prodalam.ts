import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../baseProduct/models/baseProduct.interface'

export default async function prodalamScrape(input: {
  products: BaseProduct[],
  date: Date;
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const date = input.date
  const day: string = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  const page = await browser.newPage();
  const maxTries = 15;
  let currentTry = 0;

  for (const product of input.products) {
    currentTry = 0
    while (currentTry < maxTries) {
      try {
        await page.goto(product.sku);
        await page.waitForSelector('span#gtm_price', { timeout: 5000 });

        const price = await page.$eval('span#gtm_price', (element) => {
          return element.textContent;
        });

        let webTitle = await page.$eval('div.detail__title', (element) => {
          return element.textContent;
        });

        webTitle = webTitle.trim().replace(/\\n/g, '')
        webTitle = webTitle.split('|')[0].trim()

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
