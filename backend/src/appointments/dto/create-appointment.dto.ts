import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiPropertyOptional({ example: '8fef6fd8-f53c-41cb-9b2f-c32663cc0d59' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({ example: '7be4c2f5-8645-4cce-9ba6-f66f4daf2ca1' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '2026-04-24T14:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ example: 'Cliente prefere atendimento pontual.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
