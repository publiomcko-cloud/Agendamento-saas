import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class RescheduleAppointmentDto {
  @ApiProperty({ example: '2026-04-24T15:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ example: 'Reagendado a pedido do cliente.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
