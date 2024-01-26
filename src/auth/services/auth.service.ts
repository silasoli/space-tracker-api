import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserLoginResponseDto } from '../dto/user-login-response.dto';
import { ERRORS } from '../../common/utils/constants/errors';
import { ILogin } from '../interfaces/ILogin.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(dto: UserLoginDto): Promise<ILogin> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) return null;

    const passMatch = await this.usersService.comparePass(
      dto.password,
      user.password,
    );

    if (!passMatch) return null;

    return { _id: user._id, email: user.email, username: user.username };
  }

  private async sign(user: ILogin): Promise<UserLoginResponseDto> {
    const { _id, username, email } = user;

    const payload = { email, sub: _id };

    return new UserLoginResponseDto({
      id: _id,
      email,
      username,
      access_token: this.jwtService.sign(payload),
    });
  }

  public async authenticateUser(
    dto: UserLoginDto,
  ): Promise<UserLoginResponseDto> {
    const isValidUser = await this.validateUser(dto);

    if (!isValidUser) throw ERRORS.AUTH.INVALID_CREDENTIALS;

    return this.sign(isValidUser);
  }

  public async decodeAccessToken<T extends object>(
    accessToken: string,
  ): Promise<T> {
    return this.jwtService.verifyAsync(accessToken);
  }
}
