import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.supplier.findMany({
      where: { userId, deletedAt: null },
      orderBy: { nama: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const item = await this.prisma.supplier.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }
    return item;
  }

  create(userId: number, dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        userId,
        nama: dto.nama,
        telepon: dto.telepon ?? null,
        alamat: dto.alamat ?? null,
      },
    });
  }

  async update(id: number, userId: number, dto: UpdateSupplierDto) {
    // Will throw NotFoundException if not found or not owned by user
    await this.findOne(id, userId);

    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...(dto.nama !== undefined && { nama: dto.nama }),
        ...(dto.telepon !== undefined && { telepon: dto.telepon }),
        ...(dto.alamat !== undefined && { alamat: dto.alamat }),
      },
    });
  }

  async remove(id: number, userId: number) {
    // Will throw NotFoundException if not found or not owned by user
    await this.findOne(id, userId);

    return this.prisma.supplier.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
