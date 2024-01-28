import { ApiProperty } from '@nestjs/swagger';
import { Rental } from '../schemas/rental.entity';

export class DatesRentalResponseDto {
  constructor(rental: Rental) {
    const { _id, dates } = rental;

    return {
      _id: String(_id),
      dates,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true, type: [Date] })
  dates: Date[];
}
