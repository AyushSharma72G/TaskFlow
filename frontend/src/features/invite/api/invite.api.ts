import {api} from "../../../shared/lib/axios";

export const acceptInviteApi = async (projectId: string, email: string) => {
  const { data } = await api.post(`/projects/${projectId}/members`, {
    email,
  });
  return data;
};
