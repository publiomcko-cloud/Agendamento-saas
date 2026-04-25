import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus, Prisma, UserRole } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsQueryDto } from './dto/list-payments-query.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    currentUser: AuthenticatedUser,
  ) {
    const appointment = await this.ensurePaymentAccessibleAppointment(
      createPaymentDto.appointmentId,
      currentUser,
    );
    this.ensurePaymentDataConsistency(
      createPaymentDto.status,
      createPaymentDto.paidAt,
    );

    return this.prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: new Prisma.Decimal(createPaymentDto.amount),
        status: createPaymentDto.status ?? PaymentStatus.pending,
        method: createPaymentDto.method,
        paidAt: createPaymentDto.paidAt
          ? new Date(createPaymentDto.paidAt)
          : undefined,
        externalReference: createPaymentDto.externalReference,
      },
      include: this.defaultInclude(),
    });
  }

  async findAll(query: ListPaymentsQueryDto, currentUser: AuthenticatedUser) {
    const where: Prisma.PaymentWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.appointmentId) {
      where.appointmentId = query.appointmentId;
    }

    if (currentUser.role === UserRole.client) {
      const client = await this.prisma.client.findUnique({
        where: { userId: currentUser.id },
      });

      if (!client) {
        throw new ForbiddenException(
          'O usuario cliente precisa estar vinculado a um cadastro de cliente.',
        );
      }

      where.appointment = {
        clientId: client.id,
      };
    }

    return this.prisma.payment.findMany({
      where,
      include: this.defaultInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!payment) {
      throw new NotFoundException('Pagamento nao encontrado.');
    }

    if (currentUser.role === UserRole.client) {
      const client = await this.prisma.client.findUnique({
        where: { userId: currentUser.id },
      });

      if (!client || payment.appointment.clientId !== client.id) {
        throw new ForbiddenException(
          'Clientes so podem acessar pagamentos dos proprios agendamentos.',
        );
      }
    }

    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
    currentUser: AuthenticatedUser,
  ) {
    if (currentUser.role === UserRole.client) {
      throw new ForbiddenException('Clientes nao podem atualizar pagamentos.');
    }

    const payment = await this.findOne(id, currentUser);
    this.ensurePaymentDataConsistency(
      updatePaymentDto.status,
      updatePaymentDto.paidAt,
    );

    const data: Prisma.PaymentUpdateInput = {
      status: updatePaymentDto.status,
      method: updatePaymentDto.method,
      externalReference: updatePaymentDto.externalReference,
    };

    if (typeof updatePaymentDto.amount === 'number') {
      data.amount = new Prisma.Decimal(updatePaymentDto.amount);
    }

    if (updatePaymentDto.paidAt) {
      data.paidAt = new Date(updatePaymentDto.paidAt);
    } else if (
      updatePaymentDto.status &&
      updatePaymentDto.status !== PaymentStatus.paid
    ) {
      data.paidAt = null;
    }

    return this.prisma.payment.update({
      where: { id: payment.id },
      data,
      include: this.defaultInclude(),
    });
  }

  private async ensurePaymentAccessibleAppointment(
    appointmentId: string,
    currentUser: AuthenticatedUser,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento vinculado nao encontrado.');
    }

    if (currentUser.role === UserRole.client) {
      throw new ForbiddenException('Clientes nao podem registrar pagamentos.');
    }

    if (appointment.status === 'cancelled') {
      throw new ConflictException(
        'Nao e possivel registrar pagamento para um agendamento cancelado.',
      );
    }

    return appointment;
  }

  private ensurePaymentDataConsistency(
    status?: PaymentStatus,
    paidAt?: string,
  ) {
    if (status === PaymentStatus.paid && !paidAt) {
      throw new ConflictException('Pagamentos com status paid exigem paidAt.');
    }
  }

  private defaultInclude() {
    return {
      appointment: {
        include: {
          client: true,
          service: true,
        },
      },
    } satisfies Prisma.PaymentInclude;
  }
}
