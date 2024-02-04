import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { Rental, RentalDocument } from '../schemas/rental.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '../../mailer/services/mailer.service';
import { ConfigService } from '@nestjs/config';

describe('RentalsService', () => {
  let service: RentalsService;
  let mailerService: MailerService;
  let configService: ConfigService;
  let rentalModel: Model<RentalDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        // MailerService,
        {
          provide: MailerService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: getModelToken(Rental.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
    rentalModel = module.get<Model<RentalDocument>>(getModelToken(Rental.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(configService).toBeDefined();
    expect(rentalModel).toBeDefined();
  });
});
