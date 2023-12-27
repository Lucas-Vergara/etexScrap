import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/product.model';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { BaseProductService } from './services/baseProduct.service';
import { BaseProduct, BaseProductSchema } from './models/baseProduct.model';
import { BaseProductController } from './controllers/baseProduct.controller';

@Module({
  controllers: [ProductController, BaseProductController],
  providers: [ProductService, BaseProductService],
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: BaseProduct.name, schema: BaseProductSchema }
  ])],
})
export class ProductModule {}
