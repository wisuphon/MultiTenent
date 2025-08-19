// src/tenant/tenant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
    constructor(private prisma: PrismaService) { }

    async findBySubdomain(subdomain: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: {
                subdomain,
                isActive: true
            }
        });

        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    async createTenant(data: {
        companyName: string;
        subdomain: string;
        domain?: string;
    }) {
        return this.prisma.tenant.create({
            data
        });
    }
}