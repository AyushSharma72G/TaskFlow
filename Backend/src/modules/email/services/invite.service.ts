import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from './email.service';
import { SendInvitationDto } from '../dto/send-invitation.dto';

@Injectable()
export class InviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async sendInvite(currentUserId: string, dto: SendInvitationDto) {
    const { email, projectId } = dto;

    const membership = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: currentUserId, projectId },
      },
      select: { role: true },
    });

    if (!membership) throw new NotFoundException('Project not found');
    if (membership.role !== Role.OWNER)
      throw new ForbiddenException('Only the project owner can invite members');

    const invitedUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });
    if (!invitedUser)
      throw new BadRequestException('No registered user found with that email');

    const alreadyMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: invitedUser.id, projectId },
      },
      select: { id: true },
    });
    if (alreadyMember)
      throw new BadRequestException('This user is already a member of the project');

    const [project, inviter] = await Promise.all([
      this.prisma.project.findUnique({
        where: { id: projectId },
        select: { title: true },
      }),
      this.prisma.user.findUnique({
        where: { id: currentUserId },
        select: { name: true },
      }),
    ]);

    if (!project) throw new NotFoundException('Project not found');

    this.emailService.sendInvitationEmail({
      toEmail: invitedUser.email,
      toName: invitedUser.name,
      inviterName: inviter?.name ?? 'A teammate',
      projectTitle: project.title,
      projectId,
      encodedEmail:invitedUser.email,
    });

    return { message: 'Invitation email sent successfully' };
  }
}
