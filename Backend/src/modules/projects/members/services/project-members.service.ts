import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Role, ProjectMember } from '@prisma/client';
import { ProjectsRepository } from '../../repositories/projects.repository';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { ProjectMemberWithUser } from '../../repositories/projects.repository';
import { ActivityAction } from 'src/modules/activity_log/constants/activity-action';
import { MemberInvitedEvent } from 'src/modules/activity_log/events/activity-log.events';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProjectMembersService {
    constructor(
        private readonly repo: ProjectsRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async invite(
        userId: string,
        projectId: string,
        dto: InviteMemberDto,
    ): Promise<ProjectMember> {
        const user = await this.repo.findUserByEmail(dto.email);
        if (!user) throw new BadRequestException('User not found');

        const existing = await this.repo.findUserRoleInProject(
            user.id,
            projectId,
        );

        if (existing) throw new BadRequestException('Already member');

        const invitedUser = user;

        const member = await this.repo.addMember(projectId, user.id);

        const event = new MemberInvitedEvent(projectId, userId, {
            invitedEmail: invitedUser.email,
            invitedUserName: invitedUser.name,
        });
        this.eventEmitter.emit(ActivityAction.MEMBER_INVITED, event);

        return member;
    }

    async getMembers(
        userId: string,
        projectId: string,
    ): Promise<ProjectMemberWithUser[]> {
        const role = await this.repo.findUserRoleInProject(userId, projectId);

        if (!role) throw new NotFoundException('Project not found');

        return this.repo.getProjectMembers(projectId);
    }

    async updateRole(
        userId: string,
        projectId: string,
        targetUserId: string,
        dto: UpdateMemberRoleDto,
    ): Promise<ProjectMember> {
        const role = await this.repo.findUserRoleInProject(userId, projectId);

        if (!role) throw new NotFoundException('Project not found');
        if (role !== Role.OWNER)
            throw new ForbiddenException('Only owner can update role');

        return this.repo.updateMemberRole(projectId, targetUserId, dto.role);
    }

    async remove(
        userId: string,
        projectId: string,
        targetUserId: string,
    ): Promise<ProjectMember> {
        const role = await this.repo.findUserRoleInProject(userId, projectId);

        if (!role) throw new NotFoundException('Project not found');
        if (role !== Role.OWNER)
            throw new ForbiddenException('Only owner can remove');

        return this.repo.removeMember(projectId, targetUserId);
    }
}
