import { Controller, Get, Res } from '@nestjs/common';
import { ScrapDataService } from '../services/scrapData.service';
import { ScrapData } from '../models/scrapData.model';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Controller('scrapData')
export class ScrapDataController {
  constructor(private readonly scrapDataService: ScrapDataService) {}

  @Get()
  async findAll() {
    try {
      const result = await this.scrapDataService.findAll();
      return result;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
  @Get('/download-excel')
  async downloadExcel(@Res() res: Response) {
    try {
      const scrapData: ScrapData[] = await this.scrapDataService.findAll();

      // Crear un libro de Excel
      const workbook = new ExcelJS.Workbook();

      // Iterar sobre las fechas únicas
      const uniqueDates = Array.from(new Set(scrapData.map((data) => data.date)));
      uniqueDates.forEach((date, index) => {
        const worksheet = workbook.addWorksheet(`${date.split(' ')[0]}`);

        // Agregar encabezados
        worksheet.columns = [
          { header: 'Distribuidor', key: 'distributor', width: 15 },
          { header: 'Web', key: 'web', width: 15 },
          { header: 'SKU/URL producto', key: 'skuUrl', width: 20 },
          { header: 'Descripción producto', key: 'description', width: 30 },
          { header: 'Precio', key: 'price', width: 15 },
        ];

        // Filtrar los datos para la fecha actual
        const filteredData = scrapData.filter((data) => data.date === date);

        // Agregar datos
        filteredData.forEach((data) => {
          data.homecenter.forEach((item) => {
            worksheet.addRow({
              distributor: 'Homecenter',
              web: 'Homecenter',
              skuUrl: item.SKU,
              description: item.descripcion_web,
              price: item.precio,
            });
          });

          data.yolito.forEach((item) => {
            worksheet.addRow({
              distributor: 'Yolito',
              web: 'Yolito',
              skuUrl: item.SKU,
              description: item.descripcion_web,
              price: item.precio,
            });
          });

          data.ferrobal.forEach((item) => {
            worksheet.addRow({
              distributor: 'Ferrobal',
              web: 'Ferrobal',
              skuUrl: item.SKU,
              description: item.descripcion_web,
              price: item.precio,
            });
          });
        });
      });

      // Configurar la respuesta para descargar
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=scrap-data.xlsx');

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
