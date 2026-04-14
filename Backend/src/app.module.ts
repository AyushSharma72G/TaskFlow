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

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        PrismaModule,
        AuthModule,
        ProjectsModule,
        TasksModule,
        ActivityLogModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
