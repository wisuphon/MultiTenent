// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create tenants
    const companyA = await prisma.tenant.create({
        data: {
            companyName: 'Company A',
            subdomain: 'companya',
        },
    });

    const companyB = await prisma.tenant.create({
        data: {
            companyName: 'Company B',
            subdomain: 'companyb',
        },
    });

    // Create admin users
    const passwordHash = bcrypt.hashSync('admin123', 10);

    await prisma.user.createMany({
        data: [
            {
                tenantId: companyA.id,
                username: 'admin',
                passwordHash,
                role: 'ADMIN',
            },
            {
                tenantId: companyB.id,
                username: 'admin',
                passwordHash,
                role: 'ADMIN',
            },
        ],
    });
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());