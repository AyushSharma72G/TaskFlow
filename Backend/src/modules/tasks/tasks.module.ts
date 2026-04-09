import { Module } from '@nestjs/common';
import { TasksController } from './controller/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { TaskBusinessValidator } from './validators/task-business.validator';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityLogModule } from '../activity_log/activity-log.module';

@Module({
    imports: [PrismaModule, ActivityLogModule],
    controllers: [TasksController],
    providers: [TasksService, TasksRepository, TaskBusinessValidator],
    exports: [TasksService],
})
export class TasksModule {}
