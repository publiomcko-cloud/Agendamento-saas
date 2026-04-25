import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Maria Oliveira' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'maria@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ example: 'Cliente prefere contato por WhatsApp.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ example: '8fef6fd8-f53c-41cb-9b2f-c32663cc0d59' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
