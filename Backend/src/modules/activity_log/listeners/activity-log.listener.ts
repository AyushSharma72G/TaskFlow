import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLogRepository } from '../repositories/activity-log.repository';
import { ActivityAction } from '../constants/activity-action';
import {
  TaskCreatedEvent,
  TaskStatusChangedEvent,
  TaskDeletedEvent,
  ProjectCreatedEvent,
  MemberInvitedEvent,
} from '../events/activity-log.events';

@Injectable()
export class ActivityLogListener {
  private readonly logger = new Logger(ActivityLogListener.name);

  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  @OnEvent(ActivityAction.TASK_CREATED)
  async handleTaskCreated(event: TaskCreatedEvent) {
    await this.safeLog(event);
  }

  @OnEvent(ActivityAction.TASK_STATUS_CHANGED)
  async handleTaskStatusChanged(event: TaskStatusChangedEvent) {
    await this.safeLog(event);
  }

  @OnEvent(ActivityAction.TASK_DELETED)
  async handleTaskDeleted(event: TaskDeletedEvent) {
    await this.safeLog(event);
  }

  @OnEvent(ActivityAction.PROJECT_CREATED)
  async handleProjectCreated(event: ProjectCreatedEvent) {
    await this.safeLog(event);
  }

  @OnEvent(ActivityAction.MEMBER_INVITED)
  async handleMemberInvited(event: MemberInvitedEvent) {
    await this.safeLog(event);
  }

  // Non-blocking — logging failure never crashes the primary action
  private async safeLog(event: {
    action: any;
    detail: Record<string, any>;
    projectId: string;
    userId: string;
  }) {
    try {
      await this.activityLogRepository.create({
        action: event.action,
        detail: event.detail,
        projectId: event.projectId,
        userId: event.userId,
      });
    } catch (err) {
      this.logger.error(`Failed to log activity [${event.action}]`, err);
      // intentionally swallowed — never rethrows
    }
  }
}