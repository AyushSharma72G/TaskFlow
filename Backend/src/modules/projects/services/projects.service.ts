import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Role, TaskStatus } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '../dto/projects.dto';
import {
    ProjectCreateResponse,
    ProjectDetails,
    ProjectListItem,
    ProjectUpdateResponse,
    ProjectsRepository,
} from '../repositories/projects.repository';
import { ActivityAction } from 'src/modules/activity_log/constants/activity-action';
import { EventEmitter2 } from 'eventemitter2';
import { ProjectCreatedEvent } from 'src/modules/activity_log/events/activity-log.events';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly projectsRepository: ProjectsRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    // GET /projects
    // Returns only projects where the user is a member.
    async getProjectsForUser(userId: string): Promise<ProjectListItem[]> {
        const rows =
            await this.projectsRepository.findProjectsWhereUserIsMember(userId);

        return rows;
    }

    // POST /projects
    // Creates a project and adds creator as ADMIN (mapped to Role.OWNER in DB)
    async createProject(
        userId: string,
        dto: CreateProjectDto,
    ): Promise<ProjectCreateResponse> {
        // Validate required fields explicitly (in addition to class-validator)
        if (!dto.title?.trim()) {
            throw new BadRequestException('title is required');
        }
        if (!dto.dueDate?.trim()) {
            throw new BadRequestException('dueDate is required');
        }

        // Parse the incoming ISO string into a real Date for Prisma
        const dueDate = this.parseDueDate(dto.dueDate);

        const project =
            await this.projectsRepository.createProjectAndAddOwnerMember({
                userId,
                title: dto.title.trim(),
                description: dto.description,
                dueDate,
            });

        const event = new ProjectCreatedEvent(project.id, userId, {
            projectTitle: project.title,
        });
        this.eventEmitter.emit(ActivityAction.PROJECT_CREATED, event);

        return project;
    }

    // GET /projects/:id
    // Returns full details (members + tasks) for a project the user belongs to.
    async getProjectDetails(
        userId: string,
        projectId: string,
    ): Promise<ProjectDetails> {
        const membership =
            await this.projectsRepository.findProjectDetailsForMember(
                userId,
                projectId,
            );
        if (!membership?.project) {
            throw new NotFoundException('Project not found');
        }

        const project = membership.project;

        const totalTasks = project._count.tasks;
        const completedTasks = project.tasks.filter(
            (t) => t.status === TaskStatus.DONE,
        ).length;
        const progress =
            totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100);

        return {
            id: project.id,
            title: project.title,
            description: project.description,
            dueDate: project.dueDate,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            memberCount: project._count.members,
            totalTasks,
            completedTasks,
            progress,
            members: project.members,
            tasks: project.tasks,
        };
    }

    // PATCH /projects/:id
    async updateProject(
        userId: string,
        projectId: string,
        dto: UpdateProjectDto,
    ): Promise<ProjectUpdateResponse> {
        // Ensure the user is ADMIN for this project (DB Role.OWNER)
        const role = await this.projectsRepository.findUserRoleInProject(
            userId,
            projectId,
        );
        if (!role) {
            // Not a member => they should not even know the project exists
            throw new NotFoundException('Project not found');
        }
        if (role !== Role.OWNER) {
            throw new ForbiddenException('Only admins can update this project');
        }

        // Validate that at least one field is provided
        const hasAnyField =
            dto.title !== undefined ||
            dto.description !== undefined ||
            dto.dueDate !== undefined;
        if (!hasAnyField) {
            throw new BadRequestException(
                'Provide at least one field to update',
            );
        }

        const data: { title?: string; description?: string; dueDate?: Date } =
            {};

        if (dto.title !== undefined) {
            const trimmed = dto.title.trim();
            if (!trimmed) {
                throw new BadRequestException('title cannot be empty');
            }
            data.title = trimmed;
        }

        if (dto.description !== undefined) {
            data.description = dto.description;
        }

        if (dto.dueDate !== undefined) {
            data.dueDate = this.parseDueDate(dto.dueDate);
        }

        return this.projectsRepository.updateProjectById({
            projectId,
            data,
        });
    }

    // DELETE /projects/:id
    async deleteProject(
        userId: string,
        projectId: string,
    ): Promise<{ success: true }> {
        const role = await this.projectsRepository.findUserRoleInProject(
            userId,
            projectId,
        );
        if (!role) {
            throw new NotFoundException('Project not found');
        }
        if (role !== Role.OWNER) {
            throw new ForbiddenException('Only admins can delete this project');
        }

        await this.projectsRepository.deleteProjectById(projectId);
        return { success: true };
    }

    // Helper to validate and convert dueDate to Date
    private parseDueDate(raw: string): Date {
        const parsed = new Date(raw);

        // `isNaN(parsed.getTime())` means the date string was invalid
        if (Number.isNaN(parsed.getTime())) {
            throw new BadRequestException(
                'dueDate must be a valid ISO date string',
            );
        }

        return parsed;
    }
}
