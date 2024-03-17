import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../models/product.model";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";


Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  async findAll(startDate?: string, endDate?: string): Promise<Product[]> {
    // Función auxiliar para convertir de "dd-mm-aaaa" a Date
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    try {
      const allProducts = await this.productModel.find().exec();
      const filteredProducts = allProducts.filter(product => {
        const productDate = parseDate(product.date.toString());
        const start = startDate ? parseDate(startDate) : new Date('2023-01-01');
        const end = endDate ? parseDate(endDate) : new Date('2050-12-31');
        return productDate >= start && productDate <= end;
      });
      return filteredProducts;
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