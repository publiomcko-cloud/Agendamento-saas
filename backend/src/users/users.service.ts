import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findAll(query: ListUsersQueryDto) {
    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (typeof query.active === 'string') {
      where.active = query.active === 'true';
    }

    return this.prisma.user
      .findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })
      .then((users) => users.map((user) => this.sanitizeUser(user)));
  }

  async create(createUserDto: CreateUserDto) {
    await this.ensureEmailIsAvailable(createUserDto.email);

    const createdUser = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        role: createUserDto.role,
        passwordHash: await hash(createUserDto.password, 10),
      },
    });

    return this.sanitizeUser(createdUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      await this.ensureEmailIsAvailable(updateUserDto.email, id);
    }

    const data: Prisma.UserUpdateInput = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      role: updateUserDto.role,
    };

    if (updateUserDto.password) {
      data.passwordHash = await hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.sanitizeUser(updatedUser);
  }

  async activate(id: string) {
    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { active: true },
    });

    return this.sanitizeUser(updatedUser);
  }

  async deactivate(id: string) {
    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { active: false },
    });

    return this.sanitizeUser(updatedUser);
  }

  async findOne(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return user;
  }

  sanitizeUser(user: User) {
    const { passwordHash: omittedPasswordHash, ...safeUser } = user;
    void omittedPasswordHash;
    return safeUser;
  }

  private async ensureEmailIsAvailable(email: string, currentUserId?: string) {
    const existingUser = await this.findByEmail(email);

    if (existingUser && existingUser.id !== currentUserId) {
      throw new ConflictException('Ja existe um usuario com este e-mail.');
    }
  }
}
