import { Controller, Get, Res } from '@nestjs/common';
import { ScrapingService } from '../services/scraping.service';
import * as puppeteer from 'puppeteer';
import * as ExcelJS from 'exceljs';
import { Product } from 'src/modules/product/models/product.model';
import { ProductService } from 'src/modules/product/services/product.service';
import { Response } from 'express';


@Controller()
export class ScrapingController {

  constructor(
    private readonly scrapingService: ScrapingService,
    private readonly productService: ProductService
  ) {}

  @Get('api/ejecutar-script')
  async runScrape() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    try {
      await this.scrapingService.mainScrape();
    } catch (error) {
      console.error('Error en el scraping:', error);
    } finally {
      await browser.close();
    }
  }

  @Get('api/download-excel')
  async downloadExcel(@Res() res: Response) {
    try {
      const products: Product[] = await this.productService.findAll();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('productos');

      // Agregar encabezados
      worksheet.columns = [
        { header: 'Fecha', key: 'date', width: 15 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Marca', key: 'brand', width: 15 },
        { header: 'Distribuidor', key: 'distributor', width: 15 },
        { header: 'Título Web', key: 'web_title', width: 40 },
        { header: 'SKU/URL', key: 'sku', width: 15 },
        { header: 'Precio', key: 'price', width: 15 },
      ];

      products.forEach((product) => {
        worksheet.addRow({
          date: product.date,
          name: product.name,
          brand: product.brand,
          distributor: product.distributor,
          web_title: product.web_title,
          sku: product.sku,
          price: product.price,
        });
      });

      // Configurar la respuesta para descargar
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=productos_etex.xlsx');

      // Escribir el libro de Excel en la respuesta
      await workbook.xlsx.write(res);

      // Finalizar la respuesta
      res.end();
    } catch (error) {
      console.error('Error in downloadExcel:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}


//selenium
// async ejecutarScript(): Promise<string> {
//   return this.ejecutarSeleniumScript();
// }

// ejecutarSeleniumScript(): Promise<string> {
//   return new Promise((resolve, reject) => {
//     exec('python ../selenium/main.py', (error, stdout) => {
//       if (error) {
//         console.error(`Error al ejecutar el script: ${error.message}`);
//         reject(error.message);
//         return;
//       }
//       console.log(`Script ejecutado con éxito: ${stdout}`);
//       resolve(stdout);
//     });
//   });
// }