import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './interfaces/product.interface';
import { ProductDoc } from './interfaces/product-document.interface';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ProductDTO } from './product.dto';
import { ProductRepository } from './products.repository';

const mockProduct: (
  id?: string,
  title?: string,
  description?: string,
  price?: number,
) => Product = (
  id = 'uuid1',
  title = 'Title1',
  description = 'Description1',
  price = 10.99,
) => {
  return {
    id,
    title,
    description,
    price,
  };
};

const mockProductDoc: (mock?: {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
}) => Partial<ProductDoc> = (mock?: {
  id: string;
  title: string;
  description: string;
  price: number;
}) => {
  return {
    id: (mock && mock.id) || 'uuid1',
    title: (mock && mock.title) || 'Title1',
    description: (mock && mock.description) || 'Description1',
    price: (mock && mock.price) || 10.99,
  };
};

const productArray: Product[] = [
  mockProduct(),
  mockProduct('uuid2', 'Title2', 'Description2', 11.0),
];

const productDocArray = [
  mockProductDoc(),
  mockProductDoc({
    id: 'uuid2',
    title: 'Title2',
    description: 'Description2',
    price: 11.0,
  }),
];

const mockProductRepository = {
  findProduct: jest.fn(),
  save: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<ProductDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockProduct()),
            constructor: jest.fn().mockResolvedValue(mockProduct()),
            findById: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        ProductsService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<ProductDoc>>(getModelToken('Product'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all products', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(productDocArray),
    } as any);
    const products = await service.getProducts();
    expect(products).toEqual(productArray);
  });

  it('should return a product for given ID', async () => {
    const findProductStub = {id: 'uuid1', title: 'Title1', description: 'Description1', price: 50.99};
    mockProductRepository.findProduct.mockResolvedValue(findProductStub);
    const result = await service.getSingleProduct('uuid1');
    expect(result).toEqual({id: 'uuid1', title: 'Title1', description: 'Description1', price: 50.99});
  });

  it('should create a new product', async () => {
    jest.spyOn(model, 'create').mockResolvedValueOnce({
      id: 'newID',
      title: 'New Title',
      description: 'New Description',
      price: 100.0,
    } as any);

    const newProduct = await service.insertProduct({
      title: 'New Title',
      description: 'New Description',
      price: 100.0,
    });
    expect(newProduct).toEqual('newID');
  });

  it('should update a product', async() => {
    const findProductStub = {id: 'uuid1', title: 'Title1', description: 'Description1', price: 50.99};
    mockProductRepository.findProduct.mockResolvedValue(findProductStub);
    const saveProductStub = {id: 'uuid1', title: 'New Title', description: 'Description1', price: 200.00};
    mockProductRepository.save.mockResolvedValue(saveProductStub);
    const productToUpdateDto: ProductDTO = {id: 'uuid1', title: 'New Title', price: 200.00};
    const result = await service.updateProduct(productToUpdateDto);
    expect(result).toEqual({id: 'uuid1', title: 'New Title', description: 'Description1', price: 200.00})
  });

  it('should delete a product', async () => {
    jest.spyOn(model, 'deleteOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        n: 1,
      }),
    } as any);
    expect(await service.deleteAProduct('uuid1')).toEqual({ deleted: true });
  });

  it('should not delete a product', async () => {
    jest.spyOn(model, 'deleteOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        n: 0,
      }),
    } as any);
    expect(await service.deleteAProduct('bad ID')).toEqual({
      deleted: false,
      message: 'Could Not Delete Product. No Such Product Exists',
    });
  });
});
