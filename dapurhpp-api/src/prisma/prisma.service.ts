import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    if (process.env.ENABLE_PERF_LOG === 'true') {
      (this as any).$use(async (params: any, next: any) => {
        const start = Date.now();
        const result = await next(params);
        const duration = Date.now() - start;
        console.log(
          `[PERF] prisma:${params.model}.${params.action} ${duration}ms`,
        );
        return result;
      });
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
