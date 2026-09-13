import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

import { RoleApplicationsController } from './role-applications.controller';
import { RoleApplicationsService } from './role-applications.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [RoleApplicationsController],
  providers: [RoleApplicationsService],
})
export class RoleApplicationsModule { }
