// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseProduct } from '../models/baseProduct.model';

@Injectable()
export class BaseProductService {
  constructor(@InjectModel('BaseProduct') private readonly productModel: Model<BaseProduct>) {}

  async findAll(): Promise<BaseProduct[]> {
    return this.productModel.find().exec();
  }
}
