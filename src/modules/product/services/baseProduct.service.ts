// product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseProduct } from '../models/baseProduct.model';
import singleScrape from 'src/modules/scraping/services/singleScrape';

@Injectable()
export class BaseProductService {
  constructor(@InjectModel('BaseProduct') private readonly baseProductModel: Model<BaseProduct>) {}

  async findAll(): Promise<BaseProduct[]> {
    return this.baseProductModel.find().exec();
  }

  async create(createProductDto: any): Promise<BaseProduct> {
    const newProduct = new this.baseProductModel(createProductDto);
    try {
      // Realiza el scraping del producto
      const scrapeResult = await singleScrape(newProduct);

      if (!scrapeResult) {
        throw new NotFoundException(`Producto no encontrado o scrapeResult inválido`);
      }

      return newProduct.save();
    } catch (error) {
      throw new NotFoundException(`Error durante el scraping: ${error.message}`);
    }
  }

  async update(productId: string, updateProductDto: any): Promise<BaseProduct> {
    const updatedProduct = await this.baseProductModel.findByIdAndUpdate(productId, updateProductDto, { new: true }).exec();

    try {
      if (!updatedProduct) {
        throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
      }

      const scrapeResult = await singleScrape(updatedProduct);
      // Si scrapeResult indica que el producto no fue encontrado, lanza un error
      if (!scrapeResult) {
        throw new NotFoundException(`Producto no encontrado o scrapeResult inválido`);
      }
      return updatedProduct;
    } catch (error) {
      throw new NotFoundException(`Error durante el scraping: ${error.message}`);
    }
  }

  async delete(productId: string): Promise<any> {
    const result = await this.baseProductModel.deleteOne({ _id: productId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    return result;
  }
}
