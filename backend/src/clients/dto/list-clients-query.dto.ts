import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ListClientsQueryDto {
  @ApiPropertyOptional({ example: 'maria' })
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
