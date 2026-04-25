import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: '8fef6fd8-f53c-41cb-9b2f-c32663cc0d59' })
  @IsUUID()
  appointmentId: string;

  @ApiProperty({ example: 120 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ enum: PaymentStatus, default: PaymentStatus.pending })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.pix })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({ example: '2026-05-06T14:45:00.000Z' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiPropertyOptional({ example: 'Pagamento parcial em dinheiro.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalReference?: string;
}
