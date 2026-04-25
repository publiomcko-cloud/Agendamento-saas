import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await hash('Admin@123456', 10);
  const attendantPasswordHash = await hash('Attendant@123456', 10);
  const clientPasswordHash = await hash('Client@123456', 10);

  await prisma.user.upsert({
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

  await prisma.client.upsert({
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
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
