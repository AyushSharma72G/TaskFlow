import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ActivityLogModule } from './modules/activity_log/activity-log.module';

@Module({
  imports: [PrismaModule, AuthModule, ProjectsModule ,TasksModule, ActivityLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
