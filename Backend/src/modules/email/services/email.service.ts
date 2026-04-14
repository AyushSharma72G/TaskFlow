import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { buildInvitationTemplateParams } from '../templates/invitation.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendInvitationEmail(params: {
    toEmail: string;
    toName: string;
    inviterName: string;
    projectTitle: string;
    projectId: string;
    encodedEmail: string;
  }): Promise<void> {
    const baseUrl =
      this.config.get<string>('INVITE_BASE_URL') ?? 'http://localhost:5173';

    const inviteLink = `${baseUrl}/accept/invite/${params.projectId}/${params.encodedEmail}`;

    const templateParams = buildInvitationTemplateParams({
      toEmail: params.toEmail,
      toName: params.toName,
      inviterName: params.inviterName,
      projectTitle: params.projectTitle,
      inviteLink,
    });

    try {
      await axios.post(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          service_id: this.config.get<string>('EMAILJS_SERVICE_ID'),
          template_id: this.config.get<string>('EMAILJS_TEMPLATE_ID'),
          user_id: this.config.get<string>('EMAILJS_PUBLIC_KEY'),
          accessToken: this.config.get<string>('EMAILJS_PRIVATE_KEY'),
          template_params: templateParams,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      this.logger.log(`Invitation email sent to ${params.toEmail}`);
    } catch (err: any) {
      this.logger.error(
        `Failed to send email to ${params.toEmail}: ${err?.response?.data ?? err.message}`,
      );
    }
  }
}