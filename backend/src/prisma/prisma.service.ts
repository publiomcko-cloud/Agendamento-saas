import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { createPrismaPgAdapter } from './create-prisma-pg-adapter';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured.');
    }

    const adapter = createPrismaPgAdapter(connectionString);

    super({ adapter });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
