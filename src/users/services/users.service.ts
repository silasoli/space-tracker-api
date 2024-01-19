import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.entity';
import { Model } from 'mongoose';
import Role from '../../roles/enums/role.enum';
import { UserResponseDto } from '../dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private async transformBody(dto: CreateUserDto | UpdateUserDto) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
  }

  private async findUserByID(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }

  public async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const rawData = { ...dto, roles: [Role.ADMIN] };

    await this.transformBody(rawData);

    const created = await this.userModel.create(rawData);

    return new UserResponseDto(created);
  }

  public async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find();
    return users.map((user) => new UserResponseDto(user));
  }

  public async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() }, [
      '+password',
    ]);
  }

  public async findOne(_id: string): Promise<UserResponseDto> {
    const user = await this.findUserByID(_id);
    return new UserResponseDto(user);
  }

  public async update(
    _id: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.findUserByID(_id);

    const rawData = { ...dto };

    await this.transformBody(rawData);

    await this.userModel.updateOne({ _id }, rawData);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findUserByID(_id);
    await this.userModel.deleteOne({ _id });
  }

  public async findRolesOfUser(_id: string): Promise<Role[]> {
    const user = await this.userModel.findOne({ _id }, ['roles']);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user.roles;
  }
}
