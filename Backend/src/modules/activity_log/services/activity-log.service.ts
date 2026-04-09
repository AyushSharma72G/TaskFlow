import { Injectable, Logger } from '@nestjs/common';
import { ActivityLogRepository } from '../repositories/activity-log.repository';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { QueryActivityLogDto } from '../dto/query-activity-log.dto';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(private readonly activityLogRepo: ActivityLogRepository) {}

  async log(dto: CreateActivityLogDto): Promise<void> {
    try { 
      await this.activityLogRepo.create(dto);
    } catch (err) {
      this.logger.error('Failed to write activity log', err);
    }
  }

  async getActivityFeed(userId: string, query: QueryActivityLogDto) {
    return this.activityLogRepo.findAllForUser(userId, query);
  }
}