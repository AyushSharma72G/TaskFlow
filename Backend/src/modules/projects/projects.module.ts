import { Module } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../../common/guards';
import { ProjectsController } from './controller/projects.controller';
import { ProjectsRepository } from './repositories/projects.repository';
import { ProjectsService } from './services/projects.service';
import { ProjectMembersController } from './members/controller/project-members.controller';
import { ProjectMembersService } from './members/services/project-members.service';

@Module({
    controllers: [ProjectsController, ProjectMembersController],
    providers: [
        ProjectsService,
        ProjectsRepository,
        ProjectMembersService,
        JwtCookieAuthGuard,
    ],
})
export class ProjectsModule {}
