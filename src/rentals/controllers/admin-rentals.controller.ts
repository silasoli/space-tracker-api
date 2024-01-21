import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RentalsService } from '../services/rentals.service';
import { UpdateRentalDto } from '../dto/update-rental.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserJwtGuard } from 'src/auth/guards/auth-user-jwt.guard';
import { RoleGuard } from 'src/roles/guards/role.guard';
import { IDQueryDTO } from 'src/common/dto/id-query.dto';

@ApiBearerAuth()
@ApiTags('Rentals')
@Controller('rentals')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminRentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  public async findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param() params: IDQueryDTO) {
    return this.rentalsService.findOne(params.id);
  }

  @Patch(':id')
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateRentalDto,
  ) {
    return this.rentalsService.update(params.id, dto);
  }

  @Delete(':id')
  public async remove(@Param() params: IDQueryDTO) {
    return this.rentalsService.remove(params.id);
  }
}
