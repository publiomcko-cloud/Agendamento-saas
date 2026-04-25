import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ListAppointmentsQueryDto {
  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ example: '2026-04-24T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-04-24T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ example: '8fef6fd8-f53c-41cb-9b2f-c32663cc0d59' })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}
