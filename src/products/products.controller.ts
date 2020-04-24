import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDTO } from './product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('/new')
  async addProduct(@Body() product: ProductDTO) {
    const generateID = await this.productService.insertProduct(product);
    return { id: generateID };
  }

  @Get()
  async getProducts() {
    const products = await this.productService.getProducts();
    return products;
  }

  @Get(':id')
  async getAProduct(@Param('id') id: string) {
    const foundProduct = await this.productService.getSingleProduct(id);
    return foundProduct;
  }

  @Patch('/update/:id')
  async updateAProduct(@Param('id') id: string, @Body() product: ProductDTO) {
    product.id = id;
    const updatedProduct = await this.productService.updateProduct(product);
    return updatedProduct;
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: string, @Res() res?) {
    const resp = await this.productService.deleteAProduct(id);
    if (resp.deleted) {
      return null;
    } else {
      res.status(HttpStatus.NOT_FOUND).send({ error: resp.message });
    }
  }
}
