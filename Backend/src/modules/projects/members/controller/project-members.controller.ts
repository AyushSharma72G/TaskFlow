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
import { JwtCookieAuthGuard } from '../../../../common/guards/auth.guards';
import type { AuthRequest } from '../../../../common/guards/auth.guards';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { ProjectMembersService } from '../services/project-members.service';

@Controller('projects/:projectId/members')
@UseGuards(JwtCookieAuthGuard)
export class ProjectMembersController {
    constructor(private readonly service: ProjectMembersService) {}

    @Post()
    invite(
        @Req() req: AuthRequest,
        @Param('projectId') projectId: string,
        @Body() dto: InviteMemberDto,
    ) {
        return this.service.invite(req.user.id, projectId, dto);
    }

    @Get()
    getMembers(@Req() req: AuthRequest, @Param('projectId') projectId: string) {
        return this.service.getMembers(req.user.id, projectId);
    }

    @Patch(':userId')
    updateRole(
        @Req() req: AuthRequest,
        @Param('projectId') projectId: string,
        @Param('userId') userId: string,
        @Body() dto: UpdateMemberRoleDto,
    ) {
        return this.service.updateRole(req.user.id, projectId, userId, dto);
    }

    @Delete(':userId')
    remove(
        @Req() req: AuthRequest,
        @Param('projectId') projectId: string,
        @Param('userId') userId: string,
    ) {
        return this.service.remove(req.user.id, projectId, userId);
    }
}
