import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async createUser(data: { email: string; name: string; passwordHash: string; role?: UserRole }) {
    const existed = await this.findByEmail(data.email);
    if (existed) throw new ConflictException('Email đã được sử dụng');

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role || UserRole.USER,
      },
    });

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
