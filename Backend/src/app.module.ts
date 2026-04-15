import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ActivityLogModule } from './modules/activity_log/activity-log.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './modules/email/email.module';
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from './common/cron/cron.service';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        PrismaModule,
        AuthModule,
        ProjectsModule,
        TasksModule,
        ActivityLogModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [AppService, CronService],
})
export class AppModule {}
