import { Injectable, Logger } from '@nestjs/common';
import config from '../../../config/env.config';
import axios from 'axios';
import { buildInvitationTemplateParams } from '../templates/invitation.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);


  async sendInvitationEmail(params: {
    toEmail: string;
    toName: string;
    inviterName: string;
    projectTitle: string;
    projectId: string;
    encodedEmail: string;
  }): Promise<void> {
    const baseUrl =
      config.INVITE_BASE_URL ?? 'http://localhost:5173';

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
        config.SEND_MAIL_URL ?? "",
        {
          service_id: config.EMAILJS_SERVICE_ID,
          template_id: config.EMAILJS_TEMPLATE_ID,
          user_id: config.EMAILJS_PUBLIC_KEY,
          accessToken: config.EMAILJS_PRIVATE_KEY,
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
