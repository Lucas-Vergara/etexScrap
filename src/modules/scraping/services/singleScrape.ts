import puppeteer from 'puppeteer';
import { BaseProduct } from 'src/modules/product/models/baseProduct.interface';
import ferrobalScrape from '../scripts/ferrobal';
import homecenterScrape from '../scripts/homecenter';
import tosoScrape from '../scripts/toso';
import yolitoScrape from '../scripts/yolito';

interface DistributorSelectors {
  name: string;
  priceSelector: string;
  titleSelector: string;
}

const distributors: DistributorSelectors[] =
  [
    { name: 'Construmart', priceSelector: '.vtex-product-price-1-x-sellingPriceValue', titleSelector: '.vtex-store-components-3-x-productBrand' },
    { name: 'Construplaza', priceSelector: 'span.price', titleSelector: 'div.name' },
    { name: 'Easy', priceSelector: 'div.easycl-precio-cencosud-0-x-lastPrice', titleSelector: 'span.vtex-store-components-3-x-productBrand' },
    { name: 'Ferrobal', priceSelector: '', titleSelector: '', },
    { name: 'Homecenter', priceSelector: '', titleSelector: '' },
    { name: 'Imperial', priceSelector: 'p[data-bind="currency: {price: $widgetViewModel.product().productListPrice, currencyObj: $widgetViewModel.site().selectedPriceListGroup().currency}"]', titleSelector: 'h2[data-bind="text: $widgetViewModel.product().displayName"]' },
    { name: 'Prodalam', priceSelector: 'span#gtm_price', titleSelector: 'div.detail__title' },
    { name: 'Toso', priceSelector: '', titleSelector: '' },
    { name: 'Weitzler', priceSelector: 'p.price.product-page-price', titleSelector: 'h1.product-title.product_title.entry-title' },
    { name: 'Yolito', priceSelector: '', titleSelector: '' },
  ]

export default async function singleScrape(product: BaseProduct): Promise<any> {
  if (distributorScrapers[product.distributor]) {
    return await distributorScrapers[product.distributor]({ products: [product], date: new Date, tracker: null, scrapingTrackerService: null, });
  }

  const distributorInfo = distributors.find(d => d.name === product.distributor);
  if (!distributorInfo) {
    throw new Error(`No se encontraron selectores para el distribuidor: ${product.distributor}`);
  }

  const { priceSelector, titleSelector } = distributorInfo;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  const maxTries = 10;
  let currentTry = 0;
  let result = {};

  try {
    await page.goto(product.sku);
    while (currentTry < maxTries) {
      try {
        await page.waitForSelector(priceSelector, { timeout: 2000 });

        let price = await page.$eval(priceSelector, (priceElement) => {
          // Primero, verificar si hay un elemento <del> dentro del elemento seleccionado
          const strikethroughElement = priceElement.querySelector('del');
          if (strikethroughElement) {
            // Si hay un elemento <del>, removerlo del DOM
            strikethroughElement.remove();
          }

          // Luego, obtener el texto del precio, que ahora debería ser el correcto
          return priceElement.textContent.trim();
        });
        const webTitle = await page.$eval(titleSelector, (element) => element.textContent.trim());
        result = {
          category: product.category,
          region: product.region,
          name: product.name,
          brand: product.brand,
          distributor: product.distributor,
          web_title: webTitle,
          sku: product.sku,
          presence: true,
          price: parseInt(price.replace(/[^\d]/g, '')),
        };

        console.log(result);
        return result;
      } catch (error) {
        if (currentTry + 1 === maxTries) {
          console.error(error);
          throw error;
        }
        currentTry++;
        console.error(error);
        console.log(`Intento ${currentTry}: ${product.name}`);
      }
    }
  } catch (error) {
    throw error;
  }
  await browser.close();
}

const distributorScrapers = {
  Ferrobal: ferrobalScrape,
  Sodimac: homecenterScrape,
  Toso: tosoScrape,
  Yolito: yolitoScrape,
};
