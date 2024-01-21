import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './user-rentals.controller';
import { RentalsService } from '../services/rentals.service';

describe('RentalsController', () => {
  let controller: RentalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [RentalsService],
    }).compile();

    controller = module.get<RentalsController>(RentalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
