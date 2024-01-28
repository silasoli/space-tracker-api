import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { RentalsService } from '../services/rentals.service';
import { UpdateRentalDto } from '../dto/update-rental.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import { RentalResponseDto } from '../dto/rental-response.dto';
import { Role } from 'src/roles/decorators/roles.decorator';
import Roles from 'src/roles/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Rentals')
@Controller('rentals')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminRentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @ApiOperation({ summary: 'Obter listagem de agendamentos.' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de agendamentos retornada com sucesso.',
    type: [RentalResponseDto],
  })
  @Get()
  @Role([Roles.ADMIN])
  public async findAll(): Promise<RentalResponseDto[]> {
    return this.rentalsService.findAll();
  }

  @ApiOperation({ summary: 'Obter agendamento.' })
  @ApiResponse({
    status: 200,
    description: 'Agendamento retornado com sucesso.',
    type: RentalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento não encontrado.',
  })
  @Get(':id')
  @Role([Roles.ADMIN])
  public async findOne(
    @Param() params: IDQueryDTO,
  ): Promise<RentalResponseDto> {
    return this.rentalsService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar agendamento.' })
  @ApiResponse({
    status: 200,
    description: 'Agendamento atualizado com sucesso.',
    type: RentalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento não encontrado.',
  })
  @ApiBody({ type: UpdateRentalDto })
  @Patch(':id')
  @Role([Roles.ADMIN])
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateRentalDto,
  ): Promise<RentalResponseDto> {
    return this.rentalsService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Deletar agendamento.' })
  @ApiResponse({
    status: 204,
    description: 'Agendamento deletado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento não encontrado.',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.ADMIN])
  public async remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.rentalsService.remove(params.id);
  }
}
