// import * as puppeteer from 'puppeteer';
// import { BaseProduct } from '../../product/models/baseProduct.interface'
// import { ScrapingTracker } from '../models/scrapingTracker.model';
// import { ScrapingTrackerService } from '../services/scrapingTracker.service';

// export default async function prodalamScrape(input: {
//   products: BaseProduct[],
//   date: Date,
//   tracker: ScrapingTracker,
//   scrapingTrackerService: ScrapingTrackerService
// }): Promise<any> {
//   const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
//   const results: any[] = [];
//   const day: string = input.date.getDate().toString()
//   const month: string = (input.date.getMonth() + 1).toString()
//   const year: string = (input.date.getFullYear()).toString()
//   const date: string = `${day}-${month}-${year}`
//   const page = await browser.newPage();
//   page.setDefaultNavigationTimeout(0);
//   const maxTries = 10;
//   let currentTry = 0;

//   for (const product of input.products) {
//     currentTry = 0
//     await page.goto(product.sku);
//     while (currentTry < maxTries) {
//       try {
//         await page.waitForSelector('span#gtm_price', { timeout: 10000 });

//         const price = await page.$eval('span#gtm_price', (element) => {
//           return element.textContent;
//         });

//         let webTitle = await page.$eval('div.detail__title', (element) => {
//           return element.textContent;
//         });

//         webTitle = webTitle.trim().replace(/\\n/g, '')
//         webTitle = webTitle.split('|')[0].trim()

//         const result = {
//           day,
//           month,
//           year,
//           date,
//           category: product.category,
//           region: product.region,
//           name: product.name,
//           brand: product.brand,
//           distributor: product.distributor,
//           web_title: webTitle.trim().replace(/\\n/g, ''),
//           sku: product.sku,
//           presence: true,
//           price: parseInt(price.replace(/[^\d]/g, '')),
//         };

//         results.push(result);
//         console.log(result);
//         break;
//       } catch (error) {
//         if (currentTry + 1 === maxTries) {
//           await input.scrapingTrackerService.pushToMissingProducts(
//             input.tracker._id,
//             { product: `${product.name} | ${product.brand} | ${product.distributor}`, product_url: product.sku }
//           );
//         }
//         currentTry++;
//         console.error(error);
//         console.log(currentTry);
//         console.log(product.name);
//       }
//     }
//   }
//   await browser.close();
//   return results;
// }
