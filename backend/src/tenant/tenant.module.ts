import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [TenantService, PrismaService],
    exports: [TenantService],
})
export class TenantModule {}