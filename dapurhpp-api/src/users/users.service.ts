import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // sesuaikan path kalau beda

export interface CreateUserInput {
  name: string;
  email: string;
  password: string; // sudah di-hash bcrypt SEBELUM masuk sini — service ini tidak melakukan hashing
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

async findByEmail(email: string) {
     return this.prisma.user.findUnique({
       where: { email },
     });
   }

async findById(id: number) {
     return this.prisma.user.findUnique({
       where: { id },
     });
   }

async create(data: CreateUserInput) {
     return this.prisma.user.create({
       data,
     });
   }
}