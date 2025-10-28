import { z } from "zod";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(4000, "Message is too long"),
});

export type SendMessage = z.infer<typeof sendMessageSchema>;

export interface ChatResponse {
  message: Message;
}
