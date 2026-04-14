import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InviteService } from '../services/invite.service';
import { SendInvitationDto } from '../dto/send-invitation.dto';
import { JwtCookieAuthGuard } from '../../../common/guards/auth.guards';
import type { AuthRequest } from '../../../common/guards/auth.guards';


@UseGuards(JwtCookieAuthGuard)
@Controller('invite')
export class EmailController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('send')
  sendInvite(@Req() req: AuthRequest, @Body() dto: SendInvitationDto) {
    return this.inviteService.sendInvite(req.user.id, dto);
  }
}