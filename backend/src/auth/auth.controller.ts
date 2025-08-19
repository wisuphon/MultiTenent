// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TenantService } from '../tenant/tenant.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private tenantService: TenantService,
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Req() request: Request) {
        // Extract subdomain from custom header or host header
        const tenantHost = request.headers['x-tenant-host'] as string || request.headers.host;
        const subdomain = this.extractSubdomain(tenantHost);

        // Find tenant by subdomain
        const tenant = await this.tenantService.findBySubdomain(subdomain);

        // Authenticate user
        return this.authService.login(
            tenant.id,
            loginDto.username,
            loginDto.password
        );
    }

    @Get('tenant')
    async getTenant(@Req() request: Request) {
        const tenantHost = request.headers['x-tenant-host'] as string || request.headers.host;
        const subdomain = this.extractSubdomain(tenantHost);

        return this.tenantService.findBySubdomain(subdomain);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
        return req.user;
    }

    private extractSubdomain(host: string | undefined): string {
        if (!host) return 'www';

        // Remove port number if present
        const hostWithoutPort = host.split(':')[0];
        const parts = hostWithoutPort.split('.');

        // Handle localhost subdomains (e.g., company-a.localhost)
        if (hostWithoutPort.includes('localhost')) {
            if (parts.length > 1) {
                return parts[0]; // Return subdomain part
            }
            return 'www'; // Plain localhost
        }

        // Handle regular domains (e.g., company-a.example.com)
        if (parts.length <= 2) {
            return 'www'; // No subdomain
        }

        // Return the subdomain
        return parts[0];
    }
}