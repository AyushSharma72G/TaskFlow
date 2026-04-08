import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { AuthRequest } from '../../../common/guards/auth.guards';
import { JwtCookieAuthGuard } from '../../../common/guards/auth.guards';
import { CreateProjectDto, UpdateProjectDto } from '../dto/projects.dto';
import { ProjectsService } from '../services/projects.service';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    // GET /projects
    // Returns only projects where the current user is a member.
    @Get()
    @UseGuards(JwtCookieAuthGuard)
    async getProjects(@Req() request: AuthRequest) {
        return this.projectsService.getProjectsForUser(request.user.id);
    }

    // GET /projects/:id
    // Returns full project details (members + tasks) for project members.
    @Get(':id')
    @UseGuards(JwtCookieAuthGuard)
    async getProjectDetails(
        @Req() request: AuthRequest,
        @Param('id') projectId: string,
    ) {
        return this.projectsService.getProjectDetails(
            request.user.id,
            projectId,
        );
    }

    // POST /projects
    // Creates project and adds creator as ADMIN (DB Role.OWNER).
    @Post()
    @UseGuards(JwtCookieAuthGuard)
    async createProject(
        @Req() request: AuthRequest,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectsService.createProject(request.user.id, dto);
    }

    // PATCH /projects/:id
    // Updates project fields (ADMIN/OWNER only)
    @Patch(':id')
    @UseGuards(JwtCookieAuthGuard)
    async updateProject(
        @Req() request: AuthRequest,
        @Param('id') projectId: string,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectsService.updateProject(
            request.user.id,
            projectId,
            dto,
        );
    }

    // DELETE /projects/:id
    // Deletes the project (ADMIN/OWNER only)
    @Delete(':id')
    @UseGuards(JwtCookieAuthGuard)
    async deleteProject(
        @Req() request: AuthRequest,
        @Param('id') projectId: string,
    ) {
        return this.projectsService.deleteProject(request.user.id, projectId);
    }
}
