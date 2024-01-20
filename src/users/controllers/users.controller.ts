import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDQueryDTO } from 'src/common/dto/id-query.dto';
import { RoleGuard } from 'src/roles/guards/role.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { Role } from 'src/roles/decorators/roles.decorator';
import Roles from 'src/roles/enums/role.enum';
import { AuthUserJwtGuard } from 'src/auth/guards/auth-user-jwt.guard';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Criar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta de usuário criada com sucesso',
    type: UserResponseDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @Role([Roles.ADMIN])
  public async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // @ApiOperation({ summary: 'Obter listagem de contas dos usuários' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Listagem de contas dos usuários retornada com sucesso',
  //   type: [UserResponseDto],
  // })
  // @Get()
  // @Role([Roles.ADMIN])
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @ApiOperation({ summary: 'Obter conta do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta do usuário retornada com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  @Get(':id')
  @Role([Roles.ADMIN])
  public async findOne(@Param() params: IDQueryDTO) {
    return this.usersService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Editar conta de usuário com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  @Role([Roles.ADMIN])
  public async update(@Param() params: IDQueryDTO, @Body() dto: UpdateUserDto) {
    return this.usersService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Deletar conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta do usuário deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.ADMIN])
  public async remove(@Param() params: IDQueryDTO) {
    return this.usersService.remove(params.id);
  }
}
