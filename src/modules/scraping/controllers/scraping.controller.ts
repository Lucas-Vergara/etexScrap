import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ScrapingService } from '../services/scraping.service';
import * as ExcelJS from 'exceljs';
import { Product } from 'src/modules/product/models/product.model';
import { ProductService } from 'src/modules/product/services/product.service';
import { Response } from 'express';
import { ScrapingTrackerService } from '../services/scrapingTracker.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller()
export class ScrapingController {

  constructor(
    private readonly scrapingService: ScrapingService,
    private readonly productService: ProductService,
    private readonly scrapingTrackerService: ScrapingTrackerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('api/ejecutar-script')
  async runScrape(@Req() request) {
    const user = request.user;
    const tracker = await this.scrapingTrackerService.create({ initiator: user.username, started: new Date() });

    try {
      await this.scrapingService.mainScrape(tracker);
    } catch (error) {
      console.error('Error en el scraping:', error);
    } finally {
    }

  }

  @UseGuards(JwtAuthGuard)
  @Get('api/download-excel')
  async downloadExcel(
    @Query('start') startDate: string, // Recibe la fecha de inicio como "dd-mm-aaaa"
    @Query('end') endDate: string, // Recibe la fecha de fin como "dd-mm-aaaa"
    @Res() res: Response,
  ) {
    try {
      // Si las fechas vienen en formato "dd-mm-aaaa", el servicio ya está preparado para manejarlo
      const products = await this.productService.findAll(startDate, endDate);

      // Obtener productos filtrados por el rango de fechas

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('productos');

      // Agregar encabezados
      worksheet.columns = [
        { header: 'Día', key: 'day', width: 15 },
        { header: 'Mes', key: 'month', width: 15 },
        { header: 'Año', key: 'year', width: 15 },
        { header: "Categoría", key: "category", width: 15 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Marca', key: 'brand', width: 15 },
        { header: 'Formato', key: 'format', width: 15 },
        { header: 'Distribuidor', key: 'distributor', width: 15 },
        { header: 'Región', key: 'region', width: 15 },
        { header: 'Título Web', key: 'web_title', width: 40 },
        { header: 'URL', key: 'sku', width: 15 },
        { header: 'Precio', key: 'price', width: 15 },
      ];

      products.forEach((product) => {
        worksheet.addRow({
          day: product.day,
          month: product.month,
          year: product.year,
          category: product.category,
          name: product.name,
          brand: product.brand,
          format: product.format,
          distributor: product.distributor,
          region: product.region,
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

  @UseGuards(JwtAuthGuard)
  @Get('api/last-tracker')
  async getLastTracker() {
    try {
      const lastTracker = await this.scrapingTrackerService.findLastTracker();
      return lastTracker;
    } catch (error) {
      console.error('Error in getLastTracker:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/monthly-missing-products')
  async monthlyMissingProducts() {
    try {
      return await this.scrapingTrackerService.monthlyMissingProducts();
    } catch (error) {
      console.error('Error in getLastTracker:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/daily-missing-products')
  async dailyMissingProducts() {
    try {
      return await this.scrapingTrackerService.dailyMissingProducts();
    } catch (error) {
      console.error('Error in getLastTracker:', error);
      throw error;
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