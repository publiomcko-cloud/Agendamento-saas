import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsQueryDto } from './dto/list-payments-query.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.attendant, UserRole.client)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.attendant)
  @ApiOperation({ summary: 'Registra um pagamento manual' })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.paymentsService.create(createPaymentDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Lista pagamentos conforme o perfil autenticado' })
  findAll(
    @Query() query: ListPaymentsQueryDto,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.paymentsService.findAll(query, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna o detalhe de um pagamento' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.paymentsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.attendant)
  @ApiOperation({ summary: 'Atualiza o status ou dados de um pagamento' })
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @CurrentUser() currentUser: string & AuthenticatedUser,
  ) {
    return this.paymentsService.update(id, updatePaymentDto, currentUser);
  }
}
