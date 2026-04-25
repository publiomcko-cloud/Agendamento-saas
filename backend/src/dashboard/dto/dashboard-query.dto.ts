import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class DashboardQueryDto {
  @ApiPropertyOptional({
    example: '2026-05-11T00:00:00.000Z',
    description: 'Data de referencia para calcular o dashboard do dia',
  })
  @IsOptional()
  @IsDateString()
  referenceDate?: string;
}
