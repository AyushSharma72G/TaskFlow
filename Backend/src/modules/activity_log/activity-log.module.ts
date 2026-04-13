import { Module } from '@nestjs/common';
import { ActivityLogService } from './services/activity-log.service';
import { ActivityLogController } from './controller/activity-log.controller';
import { ActivityLogRepository } from './repositories/activity-log.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityLogListener } from './listeners/activity-log.listener';

@Module({
    imports: [PrismaModule],
    controllers: [ActivityLogController],
    providers: [ActivityLogService, ActivityLogRepository, ActivityLogListener],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
