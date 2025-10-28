import { type Message } from "@shared/schema";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  addMessage(message: Message): Promise<Message>;
  clearMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: Message[];

  constructor() {
    this.messages = [];
  }

  async getMessages(): Promise<Message[]> {
    return [...this.messages];
  }

  async addMessage(message: Message): Promise<Message> {
    this.messages.push(message);
    return message;
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
  }
}

export const storage = new MemStorage();
