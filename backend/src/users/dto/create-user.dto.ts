import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ana Souza' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'ana@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.attendant })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'Senha@123456' })
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password: string;
}
