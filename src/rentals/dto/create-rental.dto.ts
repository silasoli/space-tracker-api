import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie o seu nome.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @MinLength(5, { message: 'O nome deve ser maior que 4 caracteres' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie o seu telefone.' })
  @IsNumberString({}, { message: 'Seu documento deve conter apenas números' })
  document: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie o seu telefone.' })
  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsMobilePhone(
    'pt-BR',
    { strictMode: false },
    { message: 'O telefone deve ser válido' },
  )
  phone: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie a data de check-in.' })
  @IsDateString({}, { message: 'A data de check-in deve ser válida.' })
  checkInDate: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie a data de check-out.' })
  @IsDateString({}, { message: 'A data de check-out deve ser válida.' })
  checkOutDate: Date;
}
