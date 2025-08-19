// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(tenantId: number, username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                tenantId_username: {
                    tenantId,
                    username
                }
            },
            include: {
                tenant: true
            }
        });

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(tenantId: number, username: string, password: string) {
        const user = await this.validateUser(tenantId, username, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            username: user.username,
            tenantId: user.tenantId,
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                tenant: user.tenant
            }
        };
    }

    async createUser(data: {
        tenantId: number;
        username: string;
        password: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: Role;
    }) {
        const saltRounds = 10;
        const passwordHash = bcrypt.hashSync(data.password, saltRounds);

        const { password, ...createData } = data;
        return this.prisma.user.create({
            data: {
                ...createData,
                passwordHash
            }
        });
    }
}