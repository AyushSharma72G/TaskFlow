import { Module } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../../common/guards';
import { ProjectsController } from './controller/projects.controller';
import { ProjectsRepository } from './repositories/projects.repository';
import { ProjectsService } from './services/projects.service';

@Module({

  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository, JwtCookieAuthGuard],
})
export class ProjectsModule { }

