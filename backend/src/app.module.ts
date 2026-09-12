import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VereineModule } from './vereine/vereine.module';
import { CompetitionsModule } from './competitions/competitions.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
