import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../models/product.model";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";


Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  async findAll(): Promise<Product[]> {

    try {
      const collectionName = this.productModel.collection.name;
      const dbName = this.productModel.db.name;
      console.log('Accessing collection:', collectionName, 'in database:', dbName);

      const result = await this.productModel.find().exec();
      console.log('Result from ProductService findAll:', result);
      return result
    } catch (error) {
      console.error('Error in ProductService findAll:', error);
      throw error;
    }
  }
}