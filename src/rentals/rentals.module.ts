import { Module } from '@nestjs/common';
import { RentalsService } from './services/rentals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rental, RentalSchema } from './schemas/rental.entity';
import { AdminRentalsController } from './controllers/admin-rentals.controller';
import { UserRentalsController } from './controllers/user-rentals.controller';
import { MailerService } from '../mailer/services/mailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rental.name, schema: RentalSchema }]),
  ],
  controllers: [UserRentalsController, AdminRentalsController],
  providers: [RentalsService, MailerService],
})
export class RentalsModule {}
