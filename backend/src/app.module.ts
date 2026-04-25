import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { AppLoggerService } from './common/logger/app-logger.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ClientsModule,
    ServicesModule,
    AppointmentsModule,
    PaymentsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppLoggerService],
})
export class AppModule {}
