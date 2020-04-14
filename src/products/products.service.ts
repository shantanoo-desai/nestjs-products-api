import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interfaces/product.interface';
import { ProductDoc } from './interfaces/product-document.interface';
import { ProductDTO } from './product.dto';


@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private readonly productModel: Model<ProductDoc>) {}

    async insertProduct(product: ProductDTO): Promise<string> {
        const newProduct = await this.productModel.create(product);
        return newProduct.id as string;
    }

    async getProducts(): Promise<Product[]> {
        const productDocs = await this.productModel.find().exec();
        return productDocs.map((doc) => (
            {
                id: doc.id,
                title: doc.title,
                description: doc.description,
                price: doc.price,
            }
        ));
    }

    async getSingleProduct(productID: string): Promise<Product> {
        const foundProduct = await this.findProduct(productID);
        return {
            id: foundProduct.id,
            title: foundProduct.title,
            description: foundProduct.description,
            price: foundProduct.price,
        };
    }

    async updateAProduct(product: ProductDTO ) {
        const updatedProduct = await this.findProduct(product.id);
        if (product.title) {
            updatedProduct.title = product.title;
        }
        if (product.description) {
            updatedProduct.description = product.description;
        }
        if (product.price) {
            updatedProduct.price = product.price;
        }
        updatedProduct.save()
    }

    async deleteAProduct(prodID: string) {
        const result = await this.productModel.deleteOne({_id: prodID}).exec();
        if (result.n === 0) {
            throw new NotFoundException('Could Not Delete Product. No Such Product Exists');
        }
        
        
    }

    private async findProduct(productID: string): Promise<ProductDoc> {
        let product;
        try {
            product = await this.productModel.findById(productID).exec();
        } catch(error) {
            throw new NotFoundException('Could Not Find Product for given ID.');
        }
        if (!product) {
            throw new NotFoundException('Could Not Find Product for given ID.');
        }
        return product;
    }
}
