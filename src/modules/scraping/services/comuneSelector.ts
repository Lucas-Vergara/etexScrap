import { Page } from "puppeteer";



export async function comuneSelector(input: {
  distributor: string,
  page: Page
}): Promise<void> {
  const page = input.page
  console.log(input.distributor);

  if (input.distributor === 'Prodalam') {
    try {

      await page.goto('https://www.prodalam.cl', { waitUntil: 'load' });

      const tercerElemento = await page.evaluateHandle(() => {
        return document.querySelectorAll('div.d-flex.align-items-center.justify-content-between')[2];
      });

      await tercerElemento.click();

      await delay(5000);

      // Selección de la Región
      const regionSelector = '#region .vue-treeselect__control';
      await page.waitForSelector(regionSelector, { visible: true });
      await page.click(regionSelector);

      // Resto del código...
      const inputSelector = '.vue-treeselect__input';
      await page.waitForSelector(inputSelector);
      await page.click(inputSelector); // Asegúrate de que el campo esté enfocado antes de escribir en él
      await page.type(inputSelector, 'Antofagasta', { delay: 100 }); // Ajusta el texto según sea necesario
      await page.waitForSelector('.vue-treeselect__option--highlight'); // Espera a que la opción destacada esté visible
      await page.click('.vue-treeselect__option--highlight'); // Hace clic en la opción destacada

      await delay(200000);


      // Selección de la Comuna
      const comunaSelector = '#comuna .vue-treeselect__control';
      await page.waitForSelector(comunaSelector, { visible: true });
      await page.click(comunaSelector);
      await page.waitForSelector('.vue-treeselect__option .vue-treeselect__label');

      await page.evaluate((comunaNombre) => {
        const options = Array.from(document.querySelectorAll('.vue-treeselect__option'));
        const targetOption = options.find(option => option.textContent.trim() === comunaNombre) as HTMLElement;
        targetOption?.click();
      }, 'María Pinto'); // Reemplaza 'María Pinto' con la comuna que desees seleccionar

      await delay(2000);


    } catch (error) {
      console.log(error);

    }
  }



  return
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}

