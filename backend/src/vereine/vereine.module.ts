import { Module } from '@nestjs/common';
import { VereineController } from './vereine.controller';
import { VereineService } from './vereine.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [VereineController],
  providers: [VereineService],
})
export class VereineModule { }
