import { Injectable } from '@nestjs/common';
import { ActivityLogRepository } from '../repositories/activity-log.repository';
import { QueryActivityLogDto } from '../dto/query-activity-log.dto';

@Injectable()
export class ActivityLogService {

  constructor(private readonly activityLogRepo: ActivityLogRepository) {}

  async getActivityFeed(userId: string, query: QueryActivityLogDto) {
    return this.activityLogRepo.findAllForUser(userId, query);
  }
}