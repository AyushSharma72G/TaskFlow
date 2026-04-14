export const buildInvitationTemplateParams = (params: {
  toEmail: string;
  toName: string;
  inviterName: string;
  projectTitle: string;
  inviteLink: string;
}) => ({
  to_email: params.toEmail,
  to_name: params.toName,
  from_name: params.inviterName,
  project_title: params.projectTitle,
  invite_link: params.inviteLink,
});