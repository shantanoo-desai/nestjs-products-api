import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interfaces/product.interface';
import { ProductDoc } from './interfaces/product-document.interface';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductDoc>,
  ) {}

  async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could Not Find Product for given ID.');
    }
    if (!product) {
      throw new NotFoundException('Could Not Find Product for given ID.');
    }
    return product;
  }

  async save(doc: any): Promise<Product> {
    return await new this.productModel(doc).save();
  }
}
