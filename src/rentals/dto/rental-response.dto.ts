import { ApiProperty } from '@nestjs/swagger';
import { Rental } from '../schemas/rental.entity';

export class RentalResponseDto {
  constructor(rental: Rental) {
    const { _id, name, document, phone, checkInDate, checkOutDate, dates } =
      rental;

    return {
      _id: String(_id),
      name,
      document,
      phone,
      checkInDate,
      checkOutDate,
      dates,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  document: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({ required: true })
  checkInDate: Date;

  @ApiProperty({ required: true })
  checkOutDate: Date;

  @ApiProperty({ required: true, type: [Date] })
  dates: Date[];
}
