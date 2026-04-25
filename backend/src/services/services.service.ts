import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        price: new Prisma.Decimal(createServiceDto.price),
      },
    });
  }

  findAll(query: ListServicesQueryDto, currentUser?: AuthenticatedUser) {
    const where: Prisma.ServiceWhereInput = {};

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    if (typeof query.active === 'string') {
      where.active = query.active === 'true';
    } else if (currentUser?.role === UserRole.client) {
      where.active = true;
    }

    return this.prisma.service.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Servico nao encontrado.');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);

    const data: Prisma.ServiceUpdateInput = {
      ...updateServiceDto,
    };

    if (typeof updateServiceDto.price === 'number') {
      data.price = new Prisma.Decimal(updateServiceDto.price);
    }

    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: { active: false },
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: { active: true },
    });
  }
}
