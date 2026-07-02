import 'dotenv/config';
import {
  AppointmentStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  UserRole,
} from '@prisma/client';
import { hash } from 'bcrypt';
import { createPrismaPgAdapter } from '../src/prisma/create-prisma-pg-adapter';

const adapter = createPrismaPgAdapter(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await hash('Admin@123456', 10);
  const attendantPasswordHash = await hash('Attendant@123456', 10);
  const clientPasswordHash = await hash('Client@123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin Seed',
      passwordHash: adminPasswordHash,
      role: UserRole.admin,
      active: true,
    },
    create: {
      name: 'Admin Seed',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: UserRole.admin,
      active: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'attendant@example.com' },
    update: {
      name: 'Attendant Seed',
      passwordHash: attendantPasswordHash,
      role: UserRole.attendant,
      active: true,
    },
    create: {
      name: 'Attendant Seed',
      email: 'attendant@example.com',
      passwordHash: attendantPasswordHash,
      role: UserRole.attendant,
      active: true,
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {
      name: 'Client Seed',
      passwordHash: clientPasswordHash,
      role: UserRole.client,
      active: true,
    },
    create: {
      name: 'Client Seed',
      email: 'client@example.com',
      passwordHash: clientPasswordHash,
      role: UserRole.client,
      active: true,
    },
  });

  const linkedClient = await prisma.client.upsert({
    where: { userId: clientUser.id },
    update: {
      name: 'Client Seed',
      email: 'client@example.com',
      phone: '+5511999991111',
      notes: 'Cliente base para testes locais.',
      active: true,
    },
    create: {
      name: 'Client Seed',
      email: 'client@example.com',
      phone: '+5511999991111',
      notes: 'Cliente base para testes locais.',
      active: true,
      userId: clientUser.id,
    },
  });

  const mariaClient = await upsertClientByEmail({
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    phone: '+5511988882222',
    notes: 'Prefere horarios no periodo da manha.',
  });

  const joaoClient = await upsertClientByEmail({
    name: 'Joao Santos',
    email: 'joao.santos@example.com',
    phone: '+5511977773333',
    notes: 'Cliente recorrente para acompanhamento mensal.',
  });

  const anaClient = await upsertClientByEmail({
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    phone: '+5511966664444',
    notes: 'Chega geralmente com 10 minutos de antecedencia.',
  });

  const consultationService = await upsertServiceByName({
    name: 'Consulta Inicial',
    description: 'Primeiro atendimento para entender necessidade e contexto.',
    durationMinutes: 60,
    price: 180,
    active: true,
  });

  const followUpService = await upsertServiceByName({
    name: 'Acompanhamento',
    description: 'Atendimento de acompanhamento para clientes recorrentes.',
    durationMinutes: 45,
    price: 140,
    active: true,
  });

  const planningService = await upsertServiceByName({
    name: 'Planejamento Personalizado',
    description: 'Sessao estendida para organizar proximos passos.',
    durationMinutes: 90,
    price: 260,
    active: true,
  });

  const inactiveService = await upsertServiceByName({
    name: 'Servico Arquivado',
    description: 'Exemplo de servico inativo para demonstrar filtros.',
    durationMinutes: 30,
    price: 90,
    active: false,
  });

  void inactiveService;

  const now = new Date();
  const todayAt10 = atDemoTime(now, 10, 0);
  const todayAt14 = atDemoTime(now, 14, 30);
  const tomorrowAt9 = atDemoTime(addDays(now, 1), 9, 0);
  const tomorrowAt11 = atDemoTime(addDays(now, 1), 11, 0);
  const yesterdayAt16 = atDemoTime(addDays(now, -1), 16, 0);

  const completedAppointment = await upsertAppointment({
    clientId: mariaClient.id,
    serviceId: consultationService.id,
    createdByUserId: adminUser.id,
    scheduledAt: yesterdayAt16,
    durationMinutes: consultationService.durationMinutes,
    status: AppointmentStatus.completed,
    notes: 'Atendimento concluido para demonstrar pagamento realizado.',
  });

  const todayAppointment = await upsertAppointment({
    clientId: joaoClient.id,
    serviceId: followUpService.id,
    createdByUserId: adminUser.id,
    scheduledAt: todayAt10,
    durationMinutes: followUpService.durationMinutes,
    status: AppointmentStatus.scheduled,
    notes: 'Atendimento do dia exibido no dashboard.',
  });

  await upsertAppointment({
    clientId: anaClient.id,
    serviceId: planningService.id,
    createdByUserId: adminUser.id,
    scheduledAt: todayAt14,
    durationMinutes: planningService.durationMinutes,
    status: AppointmentStatus.scheduled,
    notes: 'Sessao estendida para mostrar agenda operacional.',
  });

  await upsertAppointment({
    clientId: linkedClient.id,
    serviceId: followUpService.id,
    createdByUserId: clientUser.id,
    scheduledAt: tomorrowAt9,
    durationMinutes: followUpService.durationMinutes,
    status: AppointmentStatus.scheduled,
    notes: 'Agendamento criado para o fluxo do cliente demo.',
  });

  const cancelledAppointment = await upsertAppointment({
    clientId: mariaClient.id,
    serviceId: followUpService.id,
    createdByUserId: adminUser.id,
    scheduledAt: tomorrowAt11,
    durationMinutes: followUpService.durationMinutes,
    status: AppointmentStatus.cancelled,
    notes: 'Exemplo de agendamento cancelado para demonstrar filtros.',
  });

  await upsertPayment({
    appointmentId: completedAppointment.id,
    amount: 180,
    status: PaymentStatus.paid,
    method: PaymentMethod.pix,
    paidAt: yesterdayAt16,
    externalReference: 'DEMO-PAID-001',
  });

  await upsertPayment({
    appointmentId: todayAppointment.id,
    amount: 140,
    status: PaymentStatus.pending,
    method: PaymentMethod.credit_card,
    paidAt: null,
    externalReference: 'DEMO-PENDING-001',
  });

  await upsertPayment({
    appointmentId: cancelledAppointment.id,
    amount: 140,
    status: PaymentStatus.refunded,
    method: PaymentMethod.pix,
    paidAt: null,
    externalReference: 'DEMO-REFUNDED-001',
  });
}

async function upsertClientByEmail(input: {
  name: string;
  email: string;
  phone: string;
  notes: string;
}) {
  const existing = await prisma.client.findFirst({
    where: { email: input.email },
  });

  if (existing) {
    return prisma.client.update({
      where: { id: existing.id },
      data: {
        ...input,
        active: true,
      },
    });
  }

  return prisma.client.create({
    data: {
      ...input,
      active: true,
    },
  });
}

async function upsertServiceByName(input: {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}) {
  const existing = await prisma.service.findFirst({
    where: { name: input.name },
  });

  if (existing) {
    return prisma.service.update({
      where: { id: existing.id },
      data: input,
    });
  }

  return prisma.service.create({
    data: input,
  });
}

async function upsertAppointment(input: {
  clientId: string;
  serviceId: string;
  createdByUserId: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  notes: string;
}) {
  const endAt = addMinutes(input.scheduledAt, input.durationMinutes);
  const existing = await prisma.appointment.findFirst({
    where: {
      clientId: input.clientId,
      serviceId: input.serviceId,
      scheduledAt: input.scheduledAt,
    },
  });

  const data = {
    clientId: input.clientId,
    serviceId: input.serviceId,
    createdByUserId: input.createdByUserId,
    scheduledAt: input.scheduledAt,
    endAt,
    status: input.status,
    notes: input.notes,
  };

  if (existing) {
    return prisma.appointment.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.appointment.create({ data });
}

async function upsertPayment(input: {
  appointmentId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  paidAt: Date | null;
  externalReference: string;
}) {
  const existing = await prisma.payment.findFirst({
    where: { externalReference: input.externalReference },
  });

  const data = {
    appointmentId: input.appointmentId,
    amount: input.amount,
    status: input.status,
    method: input.method,
    paidAt: input.paidAt,
    externalReference: input.externalReference,
  };

  if (existing) {
    return prisma.payment.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.payment.create({ data });
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function atDemoTime(date: Date, hours: number, minutes: number) {
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
