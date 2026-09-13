import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VereineModule } from './vereine/vereine.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { RoleApplicationsModule } from './role-applications/role-applications.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    VereineModule,
    CompetitionsModule,
    RegistrationsModule,
    RoleApplicationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
