import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBahanBakuDto } from './dto/create-bahan-baku.dto';
import { UpdateBahanBakuDto } from './dto/update-bahan-baku.dto';

@Injectable()
export class BahanBakuService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.bahanBaku.findMany({
      where: { userId, deletedAt: null },
      orderBy: { nama: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const item = await this.prisma.bahanBaku.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Bahan baku tidak ditemukan');
    }
    return item;
  }

  create(userId: number, dto: CreateBahanBakuDto) {
    return this.prisma.bahanBaku.create({
      data: {
        userId,
        nama: dto.nama,
        satuan: dto.satuan,
        hargaTerakhir: dto.hargaTerakhir ?? 0,
      },
    });
  }

  async update(id: number, userId: number, dto: UpdateBahanBakuDto) {
    // Will throw NotFoundException if not found or not owned by user
    await this.findOne(id, userId);

    return this.prisma.bahanBaku.update({
      where: { id },
      data: {
        ...(dto.nama !== undefined && { nama: dto.nama }),
        ...(dto.satuan !== undefined && { satuan: dto.satuan }),
        ...(dto.hargaTerakhir !== undefined && { hargaTerakhir: dto.hargaTerakhir }),
      },
    });
  }

  async remove(id: number, userId: number) {
    // Will throw NotFoundException if not found or not owned by user
    await this.findOne(id, userId);

    return this.prisma.bahanBaku.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
