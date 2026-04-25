import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(query: DashboardQueryDto, currentUser: AuthenticatedUser) {
    if (currentUser.role === UserRole.client) {
      throw new ForbiddenException(
        'Clientes nao possuem acesso ao dashboard administrativo.',
      );
    }

    const { startOfDay, endOfDay } = this.getDayRange(query.referenceDate);

    const [
      totalAppointments,
      totalPayments,
      paidPaymentsAggregate,
      appointmentsToday,
      upcomingAppointments,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          scheduledAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.payment.count({
        where: {
          status: PaymentStatus.paid,
          paidAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: PaymentStatus.paid,
          paidAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          scheduledAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: this.defaultInclude(),
        orderBy: {
          scheduledAt: 'asc',
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          scheduledAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            not: AppointmentStatus.cancelled,
          },
        },
        include: this.defaultInclude(),
        orderBy: {
          scheduledAt: 'asc',
        },
        take: 5,
      }),
    ]);

    return {
      referenceDate: startOfDay.toISOString(),
      totals: {
        appointmentsToday: totalAppointments,
        paymentsToday: totalPayments,
        revenuePaidToday: paidPaymentsAggregate._sum.amount?.toString() ?? '0',
      },
      appointmentsToday,
      upcomingAppointments,
    };
  }

  private getDayRange(referenceDate?: string) {
    const baseDate = referenceDate ? new Date(referenceDate) : new Date();
    const startOfDay = new Date(baseDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  }

  private defaultInclude() {
    return {
      client: true,
      service: true,
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    } satisfies Prisma.AppointmentInclude;
  }
}
