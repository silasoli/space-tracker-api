import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { IDQueryDTO } from 'src/common/dto/id-query.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: IDQueryDTO) {
    return this.usersService.findOne(params.id);
  }

  @Patch(':id')
  public async update(@Param() params: IDQueryDTO, @Body() dto: UpdateUserDto) {
    return this.usersService.update(params.id, dto);
  }

  @Delete(':id')
  remove(@Param() params: IDQueryDTO) {
    return this.usersService.remove(params.id);
  }
}
