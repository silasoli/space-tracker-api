import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class RentalQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  finishedRent?: boolean;
}
