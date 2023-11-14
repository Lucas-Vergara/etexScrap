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

  async createOrUpdate(productData: Partial<Product>): Promise<Product> {
    const { sku, date } = productData;

    // Check if a product with the same SKU and date exists
    const existingProduct = await this.productModel.findOne({ sku, date });

    if (existingProduct) {
      // Product with the same SKU and date exists, update it
      existingProduct.set(productData);
      await existingProduct.save();
      console.log(`Product updated: SKU - ${sku}, Date - ${date}`);
      return existingProduct;
    } else {
      // Product with the same SKU and date does not exist, create a new one
      const createdProduct = new this.productModel(productData);
      await createdProduct.save();
      console.log(`Product created: SKU - ${sku}, Date - ${date}`);
      return createdProduct;
    }
  }
}