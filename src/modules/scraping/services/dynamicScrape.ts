import { BaseProduct } from "src/modules/product/models/baseProduct.interface";
import { ScrapingTracker } from "../models/scrapingTracker.model";
import { ScrapingTrackerService } from "./scrapingTracker.service";
import puppeteer from "puppeteer";
import ferrobalScrape from "../scripts/ferrobal";
import homecenterScrape from "../scripts/homecenter";
import tosoScrape from "../scripts/toso";
import yolitoScrape from "../scripts/yolito";


export default async function dynamicScrape(input: {
  products: BaseProduct[],
  date: Date,
  tracker: ScrapingTracker,
  scrapingTrackerService: ScrapingTrackerService,
  priceSelector: string,
  titleSelector: string,
}): Promise<any> {

  // retornar casos especiales
  if (distributorScrapers[input.products[0].distributor]) {
    return await distributorScrapers[input.products[0].distributor]({ products: input.products, date: input.date, tracker: input.tracker, scrapingTrackerService: input.scrapingTrackerService, });
  }

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const results: any[] = [];
  const day: string = input.date.getDate().toString()
  const month: string = (input.date.getMonth() + 1).toString()
  const year: string = (input.date.getFullYear()).toString()
  const date: string = `${day}-${month}-${year}`
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  const maxTries = 10;

  for (const product of input.products) {
    let currentTry = 0;
    await page.goto(product.sku);
    while (currentTry < maxTries) {
      try {
        await page.waitForSelector(input.priceSelector, { timeout: 10000 });

        let price = await page.$eval(input.priceSelector, (priceElement) => {
          // Primero, verificar si hay un elemento <del> dentro del elemento seleccionado
          const strikethroughElement = priceElement.querySelector('del');
          if (strikethroughElement) {
            // Si hay un elemento <del>, removerlo del DOM
            strikethroughElement.remove();
          }

          // Luego, obtener el texto del precio, que ahora debería ser el correcto
          return priceElement.textContent.trim();
        });

        const webTitle = await page.$eval(input.titleSelector, (element) => {
          return element.textContent.trim();
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
          web_title: webTitle,
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

const distributorScrapers = {
  Ferrobal: ferrobalScrape,
  Sodimac: homecenterScrape,
  Toso: tosoScrape,
  Yolito: yolitoScrape,
};

