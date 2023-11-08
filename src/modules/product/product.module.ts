import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './models/product.model';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
})
export class ProductModule {}
