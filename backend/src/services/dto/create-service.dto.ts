import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Corte Masculino' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'Servico tradicional com acabamento.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 45 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}
