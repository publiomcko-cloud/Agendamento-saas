import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    await this.ensureUserLinkIsValid(createClientDto.userId);

    return this.prisma.client.create({
      data: createClientDto,
    });
  }

  findAll(query: ListClientsQueryDto) {
    const where: Prisma.ClientWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (typeof query.active === 'string') {
      where.active = query.active === 'true';
    }

    return this.prisma.client.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente nao encontrado.');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id);
    await this.ensureUserLinkIsValid(updateClientDto.userId, id);

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.client.update({
      where: { id },
      data: { active: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  private async ensureUserLinkIsValid(
    userId?: string,
    currentClientId?: string,
  ) {
    if (!userId) {
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { client: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario vinculado nao encontrado.');
    }

    if (user.role !== UserRole.client) {
      throw new ConflictException(
        'A vinculacao do cliente exige um usuario com papel client.',
      );
    }

    if (user.client && user.client.id !== currentClientId) {
      throw new ConflictException(
        'Este usuario ja esta vinculado a outro cliente.',
      );
    }
  }
}
