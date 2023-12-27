// product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseProduct } from '../models/baseProduct.model';

@Injectable()
export class BaseProductService {
  constructor(@InjectModel('BaseProduct') private readonly productModel: Model<BaseProduct>) {}

  async findAll(): Promise<BaseProduct[]> {
    return this.productModel.find().exec();
  }

  async create(createProductDto: any): Promise<BaseProduct> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async update(productId: string, updateProductDto: any): Promise<BaseProduct> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(productId, updateProductDto, { new: true }).exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    return updatedProduct;
  }

  async delete(productId: string): Promise<any> {
    const result = await this.productModel.deleteOne({ _id: productId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    return result;
  }
}
