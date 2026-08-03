import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePengeluaranLainDto } from './dto/create-pengeluaran-lain.dto';
import { UpdatePengeluaranLainDto } from './dto/update-pengeluaran-lain.dto';
import { PengeluaranLainQueryDto } from './dto/pengeluaran-lain-query.dto';

@Injectable()
export class PengeluaranLainService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number, query?: PengeluaranLainQueryDto) {
    const where: any = { userId };
    if (query?.tanggal) {
      where.tanggal = new Date(query.tanggal);
    }
    return this.prisma.pengeluaranLain.findMany({
      where,
      orderBy: { tanggal: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const item = await this.prisma.pengeluaranLain.findFirst({
      where: { id, userId },
    });
    if (!item) {
      throw new NotFoundException('Pengeluaran tidak ditemukan');
    }
    return item;
  }

  create(userId: number, dto: CreatePengeluaranLainDto) {
    return this.prisma.pengeluaranLain.create({
      data: {
        userId,
        tanggal: new Date(dto.tanggal),
        nama: dto.nama,
        jumlah: dto.jumlah,
        kategori: dto.kategori,
      },
    });
  }

  async update(id: number, userId: number, dto: UpdatePengeluaranLainDto) {
    await this.findOne(id, userId);
    return this.prisma.pengeluaranLain.update({
      where: { id },
      data: {
        ...(dto.tanggal !== undefined && { tanggal: new Date(dto.tanggal) }),
        ...(dto.nama !== undefined && { nama: dto.nama }),
        ...(dto.jumlah !== undefined && { jumlah: dto.jumlah }),
        ...(dto.kategori !== undefined && { kategori: dto.kategori }),
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.prisma.pengeluaranLain.delete({ where: { id } });
    return { message: 'Pengeluaran berhasil dihapus' };
  }
}
