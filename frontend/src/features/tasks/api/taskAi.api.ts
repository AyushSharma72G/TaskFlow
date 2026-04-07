import { api } from "../../../shared/lib/axios";
import type {
  GenerateDescriptionPayload,
  GenerateDescriptionResponse,
} from "../types";

export const taskAiApi = {
  async generateDescription(
    payload: GenerateDescriptionPayload,
  ): Promise<GenerateDescriptionResponse> {
    const response = await api.post("/tasks/ai/generate-description", payload);
    return response.data;
  },
};
