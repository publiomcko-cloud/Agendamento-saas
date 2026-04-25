import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ListUsersQueryDto {
  @ApiPropertyOptional({ example: 'ana' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsOptional()
  @IsBooleanString()
  active?: string;
}
