import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ActivityLogService } from '../services/activity-log.service';
import { QueryActivityLogDto } from '../dto/query-activity-log.dto';
import { JwtCookieAuthGuard } from 'src/common/guards/auth.guards';

@UseGuards(JwtCookieAuthGuard)
@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async getFeed(@Req() req: any, @Query() query: QueryActivityLogDto) {
    const userId = req.user.id;
    const data = await this.activityLogService.getActivityFeed(userId, query);
    return {
      success: true,
      message: 'Activity feed fetched successfully',
      data,
    };
  }
} 