import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { Rental, RentalDocument } from '../schemas/rental.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('RentalsService', () => {
  let service: RentalsService;
  let rentalModel: Model<RentalDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: getModelToken(Rental.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    rentalModel = module.get<Model<RentalDocument>>(getModelToken(Rental.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(rentalModel).toBeDefined();
  });
});
