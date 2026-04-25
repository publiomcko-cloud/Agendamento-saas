import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { SignOptions } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const passwordMatches = await compare(loginDto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const expiresIn =
      (this.configService.get<string>(
        'JWT_EXPIRES_IN',
      ) as SignOptions['expiresIn']) ?? '1d';

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn,
      }),
      user: this.usersService.sanitizeUser(user),
    };
  }

  async validateJwtUser(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.active) {
      throw new UnauthorizedException('Usuario autenticado nao encontrado.');
    }

    return user;
  }
}
