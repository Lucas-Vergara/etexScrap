import { Controller, Post, Put, Delete, Body, Param, Get } from '@nestjs/common';
import { BaseProductService } from '../services/baseProduct.service';
import { CreateBaseProductDto, DeleteBaseProductDto, UpdateBaseProductDto } from '../dtos/baseProduct.dtos';

@Controller('api/base-products')
export class BaseProductController {
  constructor(private baseProductService: BaseProductService) {}

  @Get()
  async findAllBaseProducts() {
    try {
      const result = await this.baseProductService.findAll();
      return result;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  @Post()
  async create(@Body() createBaseProductDto: CreateBaseProductDto) {
    return this.baseProductService.create(createBaseProductDto);
  }

  @Put()
  async update(@Body() updateBaseProductDto: UpdateBaseProductDto) {
    const { _id, ...updateData } = updateBaseProductDto;
    return this.baseProductService.update(_id, updateData);
  }

  @Delete()
  async delete(@Body() deleteBaseProductDto: DeleteBaseProductDto) {
    return this.baseProductService.delete(deleteBaseProductDto._id);
  }

}
