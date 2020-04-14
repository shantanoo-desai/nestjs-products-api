import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

const testTitle = 'Amazing Title Test';
const testDescription = 'Wow what a description';

describe('Products Controller', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getProducts: jest.fn().mockResolvedValue(
              [
                {id: 'uuid1', title: 'Title1', description: 'Description1', price: 10.99},
                {id: 'uuid2', title: 'Title2', description: 'Description2', price: 11.00}
              ]
            ),
            getSingleProduct: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id: id,
                title: testTitle,
                description: testDescription,
                price: 60.00,
              }),
            ),
          }
        }
      ]
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should get an array of products', () => {
      expect(controller.getProducts()).resolves.toEqual([
        {
          id: 'uuid1',
          title: 'Title1',
          description: 'Description1',
          price: 10.99
        },
        {
          id: 'uuid2',
          title: 'Title2',
          description: 'Description2',
          price: 11.00
        }
      ]);
    });
  });

  describe('getAProduct', () => {
    it('should get a product from given ID', () => {
      expect(controller.getAProduct('inputID')).resolves.toEqual({
        id: 'inputID',
        title: testTitle,
        description: testDescription,
        price: 60.00,
      });
      expect(controller.getAProduct('anotherUniqueID')).resolves.toEqual({
        id: 'anotherUniqueID',
        title: testTitle,
        description: testDescription,
        price: 60.00,
      });
    })
  });
});
