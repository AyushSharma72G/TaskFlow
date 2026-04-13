import { ActivityActionType } from '../constants/activity-action';

export class ActivityLogEvent<TDetail> {
    constructor(
        public readonly action: ActivityActionType,
        public readonly projectId: string,
        public readonly userId: string,
        public readonly detail: TDetail,
    ) {}
}

export class TaskCreatedEvent extends ActivityLogEvent<{
    taskTitle: string;
    assigneeIds: string[];
}> {
    constructor(
        projectId: string,
        userId: string,
        detail: { taskTitle: string; assigneeIds: string[] },
    ) {
        super('TASK_CREATED', projectId, userId, detail);
    }
}

export class TaskStatusChangedEvent extends ActivityLogEvent<{
    taskTitle: string;
    from: string;
    to: string;
}> {
    constructor(
        projectId: string,
        userId: string,
        detail: { taskTitle: string; from: string; to: string },
    ) {
        super('TASK_STATUS_CHANGED', projectId, userId, detail);
    }
}

export class TaskDeletedEvent extends ActivityLogEvent<{
    taskTitle: string;
}> {
    constructor(
        projectId: string,
        userId: string,
        detail: { taskTitle: string },
    ) {
        super('TASK_DELETED', projectId, userId, detail);
    }
}

export class ProjectCreatedEvent extends ActivityLogEvent<{
    projectTitle: string;
}> {
    constructor(
        projectId: string,
        userId: string,
        detail: { projectTitle: string },
    ) {
        super('PROJECT_CREATED', projectId, userId, detail);
    }
}

export class MemberInvitedEvent extends ActivityLogEvent<{
    invitedEmail: string;
    invitedUserName: string;
}> {
    constructor(
        projectId: string,
        userId: string,
        detail: { invitedEmail: string; invitedUserName: string },
    ) {
        super('MEMBER_INVITED', projectId, userId, detail);
    }
}
