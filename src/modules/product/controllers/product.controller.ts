import { Controller, Get } from "@nestjs/common";
import { ProductService } from "../services/product.service";


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    try {
      const result = await this.productService.findAll();
      return result;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }


}