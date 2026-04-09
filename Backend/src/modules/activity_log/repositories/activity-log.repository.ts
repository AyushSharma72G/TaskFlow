import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // adjust path
import { Prisma } from '@prisma/client';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { QueryActivityLogDto } from '../dto/query-activity-log.dto';

@Injectable()
export class ActivityLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateActivityLogDto) {
    return this.prisma.activityLog.create({
      data: {
        action: dto.action,
        details: dto.detail ?? Prisma.JsonNull,
        projectId: dto.projectId,
        userId: dto.userId,
      },
    });
  } 

  async findAllForUser(userId: string, query: QueryActivityLogDto) {
    const { projectId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    // Only return logs for projects the user belongs to
    const where: any = {
      project: {
        members: {
          some: { userId },
        },
      },
    };

    if (projectId) {
      where.projectId = projectId;
    }

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
          project: {
            select: { id: true, title: true },
          },
        },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return { logs, total, page, limit };
  }
}