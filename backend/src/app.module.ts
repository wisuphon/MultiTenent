import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { DemoController } from './demo/demo.controller';

@Module({
  imports: [AuthModule, TenantModule],
  controllers: [AppController, DemoController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
