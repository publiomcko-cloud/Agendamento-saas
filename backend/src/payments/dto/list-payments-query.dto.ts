import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ListPaymentsQueryDto {
  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ example: '8fef6fd8-f53c-41cb-9b2f-c32663cc0d59' })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;
}
