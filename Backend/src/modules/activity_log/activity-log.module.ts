import { Module } from '@nestjs/common';
import { ActivityLogService } from './services/activity-log.service';
import { ActivityLogController } from './controller/activity-log.controller';
import { ActivityLogRepository } from './repositories/activity-log.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ActivityLogController],
    providers: [ActivityLogService, ActivityLogRepository],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
