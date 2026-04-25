import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ListServicesQueryDto {
  @ApiPropertyOptional({ example: 'corte' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filtra por status ativo',
  })
  @IsOptional()
  @IsBooleanString()
  active?: string;
}
