import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { TenantService } from '../tenant/tenant.service';
import { Role } from '@prisma/client';

@Controller('demo')
export class DemoController {
    constructor(
        private authService: AuthService,
        private tenantService: TenantService,
    ) { }

    @Post('setup')
    async setupDemo() {
        // Create tenants for Company A, B, and C
        const tenantA = await this.tenantService.createTenant({
            companyName: 'Company A',
            subdomain: 'company-a'
        });

        const tenantB = await this.tenantService.createTenant({
            companyName: 'Company B', 
            subdomain: 'company-b'
        });

        const tenantC = await this.tenantService.createTenant({
            companyName: 'Company C',
            subdomain: 'company-c'
        });

        // Create admin users for each tenant (same username "admin" but different tenants)
        const adminA = await this.authService.createUser({
            tenantId: tenantA.id,
            username: 'admin',
            password: 'password123',
            email: 'admin@company-a.com',
            firstName: 'Admin',
            lastName: 'A',
            role: Role.ADMIN
        });

        const adminB = await this.authService.createUser({
            tenantId: tenantB.id,
            username: 'admin',
            password: 'password123',
            email: 'admin@company-b.com',
            firstName: 'Admin',
            lastName: 'B',
            role: Role.ADMIN
        });

        const adminC = await this.authService.createUser({
            tenantId: tenantC.id,
            username: 'admin',
            password: 'password123',
            email: 'admin@company-c.com',
            firstName: 'Admin',
            lastName: 'C',
            role: Role.ADMIN
        });

        // Create other users for each tenant
        const userA = await this.authService.createUser({
            tenantId: tenantA.id,
            username: 'user1',
            password: 'password123',
            email: 'user1@company-a.com',
            firstName: 'User',
            lastName: 'A1',
            role: Role.USER
        });

        const managerB = await this.authService.createUser({
            tenantId: tenantB.id,
            username: 'manager',
            password: 'password123',
            email: 'manager@company-b.com',
            firstName: 'Manager',
            lastName: 'B',
            role: Role.MANAGER
        });

        return {
            message: 'Demo data created successfully!',
            tenants: [tenantA, tenantB, tenantC],
            users: [adminA, adminB, adminC, userA, managerB],
            instructions: {
                loginEndpoints: [
                    'POST /auth/login with Host: company-a.localhost:3000',
                    'POST /auth/login with Host: company-b.localhost:3000', 
                    'POST /auth/login with Host: company-c.localhost:3000'
                ],
                credentials: {
                    allAdmins: { username: 'admin', password: 'password123' },
                    companyAUser: { username: 'user1', password: 'password123' },
                    companyBManager: { username: 'manager', password: 'password123' }
                }
            }
        };
    }
}