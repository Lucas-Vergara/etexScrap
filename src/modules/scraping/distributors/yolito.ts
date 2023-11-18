import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../product/models/baseProduct.interface'

export default async function yolitoScrape(input: {
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
  const base_url = "https://www.yolito.cl/Home/SetDeliveryMethod?isDelivery=True&idComuna="
  await page.goto(base_url + "Las Condes")
  await page.goto("https://www.yolito.cl/")
  const maxTries = 15;
  let currentTry = 0;

  for (const product of input.products) {
    currentTry = 0
    await page.goto(product.sku);
    while (currentTry < maxTries) {

      try {
        // Espera a que aparezca el elemento de precio
        await page.waitForSelector('span[style="font-size:30px;font-weight:bold"]');

        // Obtiene el precio
        const priceElement = await page.$('span[style="font-size:30px;font-weight:bold"]');
        const priceText = await priceElement?.evaluate((element) => element.textContent);
        const price = parseInt(priceText?.replace(".", "").replace("$", "") || '0', 10);

        // Obtiene el nombre
        const nameElement = await page.$('.s_info-name[itemprop="name"]');
        const webTitle = await nameElement?.evaluate((element) => element.textContent);

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
