import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { InviteService } from './services/invite.service';
import { EmailController } from './controller/email.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [EmailService, InviteService, PrismaService],
  exports: [EmailService], // export if other modules ever need to send emails
})
export class EmailModule {}