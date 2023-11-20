import { Controller, Get, UseGuards } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
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