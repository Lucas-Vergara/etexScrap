import { Controller, Post, Put, Delete, Body, Param, Get, Res } from '@nestjs/common';
import { BaseProductService } from '../services/baseProduct.service';
import { CreateBaseProductDto, DeleteBaseProductDto, UpdateBaseProductDto } from '../dtos/baseProduct.dtos';
import * as ExcelJS from 'exceljs';

@Controller('api/base-products')
export class BaseProductController {
  constructor(private baseProductService: BaseProductService) {}

  @Get()
  async findAllBaseProducts() {
    try {
      const result = await this.baseProductService.findAll();
      return result;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  @Post()
  async create(@Body() createBaseProductDto: CreateBaseProductDto) {
    return this.baseProductService.create(createBaseProductDto);
  }

  @Put()
  async update(@Body() updateBaseProductDto: UpdateBaseProductDto) {
    const { _id, ...updateData } = updateBaseProductDto;
    return this.baseProductService.update(_id, updateData);
  }

  @Delete()
  async delete(@Body() deleteBaseProductDto: DeleteBaseProductDto) {
    return this.baseProductService.delete(deleteBaseProductDto._id);
  }

  @Get('/download')
  async downloadAllBaseProducts(@Res() res: any) {
    const products = await this.baseProductService.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Base Products');

    // Definir las columnas del archivo Excel basado en tu esquema de BaseProduct
    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 20 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Marca', key: 'brand', width: 20 },
      { header: 'Distribuidor', key: 'distributor', width: 25 },
      { header: 'Categoría', key: 'category', width: 20 },
      { header: 'Región', key: 'region', width: 20 },
      { header: 'Formato', key: 'format', width: 20 },
    ];

    // Añadir los datos de los productos al archivo
    products.forEach((product) => {
      worksheet.addRow({
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        distributor: product.distributor,
        category: product.category,
        region: product.region,
        format: product.format || '', // Incluye el campo formato si está presente, de lo contrario usa una cadena vacía
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="BaseProducts.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  }

}
