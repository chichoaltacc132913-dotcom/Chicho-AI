import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatWithGemini } from "./gemini";
import { sendMessageSchema, type Message, type ChatResponse } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const validation = sendMessageSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: validation.error.errors[0]?.message || "Invalid message" 
        });
      }

      const { content } = validation.data;

      const userMessage: Message = {
        id: randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      const conversationHistory = await storage.getMessages();
      const fullHistory = [...conversationHistory, userMessage];

      const aiResponse = await chatWithGemini(fullHistory);

      await storage.addMessage(userMessage);

      const aiMessage: Message = {
        id: randomUUID(),
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      };

      await storage.addMessage(aiMessage);

      const response: ChatResponse = {
        message: aiMessage,
      };

      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "An error occurred while processing your message" 
      });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json({ messages });
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });

  app.delete("/api/messages", async (req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error) {
      console.error("Clear messages error:", error);
      res.status(500).json({ message: "Failed to clear messages" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
