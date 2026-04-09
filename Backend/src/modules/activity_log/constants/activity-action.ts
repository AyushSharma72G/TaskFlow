export const ActivityAction = {
  PROJECT_CREATED: 'PROJECT_CREATED',
  MEMBER_INVITED: 'MEMBER_INVITED',
  TASK_CREATED: 'TASK_CREATED',
  TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED',
  TASK_DELETED: 'TASK_DELETED',
} as const;

export type ActivityActionType = keyof typeof ActivityAction;