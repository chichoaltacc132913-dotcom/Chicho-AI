import { type Message } from "@shared/schema";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div
      className={`flex items-start gap-2 ${isUser ? "ml-auto" : "mr-auto"} max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-200`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      {!isUser && (
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-muted-foreground px-1">Chicho AI</span>
          <div className="bg-accent text-accent-foreground rounded-2xl rounded-bl-sm px-4 py-3">
            <p className="text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>
      )}
      {isUser && (
        <div className="flex flex-col gap-1 flex-1">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3 ml-auto">
            <p className="text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
