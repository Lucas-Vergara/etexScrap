import * as puppeteer from 'puppeteer';
import { BaseProduct } from '../../baseProduct/models/baseProduct.interface'

export default async function yolitoScrape(input: {
  products: BaseProduct[],
  date: Date;
}): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const date = input.date
  const day: string = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  const page = await browser.newPage();
  const base_product_url = "https://www.yolito.cl/Producto/"
  const base_url = "https://www.yolito.cl/Home/SetDeliveryMethod?isDelivery=True&idComuna="
  await page.goto(base_url + "Las Condes")
  await page.goto("https://www.yolito.cl/")

  for (const product of input.products) {


    await page.goto(`${base_product_url}${product.sku}`);

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
