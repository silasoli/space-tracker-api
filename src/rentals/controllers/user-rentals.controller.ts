import { Controller, Body, Post } from '@nestjs/common';
import { RentalsService } from '../services/rentals.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { RentalResponseDto } from '../dto/rental-response.dto';

@ApiTags('Rentals')
@Controller('rentals')
export class UserRentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @ApiOperation({ summary: 'Criar agendamento.' })
  @ApiResponse({
    status: 200,
    description: 'Agendamento criado com sucesso.',
    type: RentalResponseDto,
  })
  @ApiBody({ type: CreateRentalDto })
  @Post()
  public async create(
    @Body() dto: CreateRentalDto,
  ): Promise<RentalResponseDto> {
    return this.rentalsService.create(dto);
  }
}
