import { Controller, Body, Post, Get } from '@nestjs/common';
import { RentalsService } from '../services/rentals.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRentalDto } from '../dto/create-rental.dto';
import { RentalResponseDto } from '../dto/rental-response.dto';
import { DatesRentalResponseDto } from '../dto/dates-rentals-response.dto';

@ApiTags('Rentals')
@Controller('rentals')
export class UserRentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @ApiOperation({ summary: 'Obter data dos agendamentos.' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de datas retornada com sucesso.',
    type: [DatesRentalResponseDto],
  })
  @Get('dates')
  public async findAll(): Promise<DatesRentalResponseDto[]> {
    return this.rentalsService.findUnavailableDates();
  }

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
