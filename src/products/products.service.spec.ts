import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './interfaces/product.interface';
import { ProductDoc } from './interfaces/product-document.interface';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { async } from 'rxjs/internal/scheduler/async';

const mockProduct: (
  id?: string,
  title?: string,
  description?: string,
  price?: number
) => Product = (
  id = 'uuid1',
  title = 'Title1',
  description = 'Description1',
  price = 10.99
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
  mockProduct('uuid2', 'Title2', 'Description2', 11.00),
];

const productDocArray = [
  mockProductDoc(),
  mockProductDoc({id: 'uuid2', title: 'Title2', description: 'Description2', price: 11.00}),
];


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
          },
        },
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

  it('should return all products', async() => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(productDocArray),
    } as any);
    const products = await service.getProducts();
    expect(products).toEqual(productArray);
  });

  it('should return a product for given ID', async() => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(
        mockProductDoc({id: 'uuid1', title: 'Title1', description: 'Description1', price: 50.99})
      ),
    } as any);
    const findMockProduct = mockProduct('uuid1', 'Title1', 'Description1', 50.99);
    const foundProduct = await service.getSingleProduct('uuid1');
    expect(foundProduct).toEqual(findMockProduct);

  });

  it('should create a new product', async() => {
    jest.spyOn(model, 'create').mockResolvedValueOnce({
      id: 'newID',
      title: 'New Title',
      description: 'New Description',
      price: 100.00
    } as any);
    
    const newProduct = await service.insertProduct({
      title: 'New Title',
      description: 'New Description',
      price: 100.00
    });
    expect(newProduct).toEqual('newID');
  });
});
