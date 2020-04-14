import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';


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
});
