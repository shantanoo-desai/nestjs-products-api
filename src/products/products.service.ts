import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interfaces/product.interface';
import { ProductDoc } from './interfaces/product-document.interface';
import { ProductDTO } from './product.dto';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductDoc>,
    private readonly repository: ProductRepository,
  ) {}

  async insertProduct(product: ProductDTO): Promise<string> {
    const newProduct = await this.productModel.create(product);
    return newProduct.id as string;
  }

  async getProducts(): Promise<Product[]> {
    const productDocs = await this.productModel.find().exec();
    return productDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      price: doc.price,
    }));
  }

  async getSingleProduct(productID: string): Promise<Product> {
    const foundProduct = await this.repository.findProduct(productID);
    return {
      id: foundProduct.id,
      title: foundProduct.title,
      description: foundProduct.description,
      price: foundProduct.price,
    };
  }

  async updateProduct(product: ProductDTO): Promise<Product> {
    const updatedProduct = await this.repository.findProduct(product.id);
    if (product.title) {
      updatedProduct.title = product.title;
    }
    if (product.description) {
      updatedProduct.description = product.description;
    }
    if (product.price) {
      updatedProduct.price = product.price;
    }
    const update = await this.repository.save(updatedProduct);
    return {
        id: update.id,
        title: update.title,
        description: update.description,
        price: update.price,
    };
  }

  async deleteAProduct(
    prodID: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.productModel.deleteOne({ _id: prodID }).exec();
    if (result.n === 0) {
      return {
        deleted: false,
        message: 'Could Not Delete Product. No Such Product Exists',
      };
    } else {
      return { deleted: true };
    }
  }
}
