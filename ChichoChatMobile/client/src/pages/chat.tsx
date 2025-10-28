import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { TypingIndicator } from "@/components/typing-indicator";
import { type Message } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowDown, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ChatPage() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: messagesData, isLoading } = useQuery<{ messages: Message[] }>({
    queryKey: ["/api/messages"],
  });

  const messages = (messagesData?.messages || []).filter(Boolean);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const optimisticUserMessage: Message = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
      };

      queryClient.setQueryData<{ messages: Message[] }>(["/api/messages"], (old) => ({
        messages: [...(old?.messages || []), optimisticUserMessage],
      }));

      const response = await apiRequest("POST", "/api/chat", {
        content,
      });
      
      const data = await response.json() as { message: Message };
      return data.message;
    },
    onSuccess: (aiMessage) => {
      if (!aiMessage || !aiMessage.id) {
        console.error("Invalid AI message received:", aiMessage);
        queryClient.setQueryData<{ messages: Message[] }>(["/api/messages"], (old) => ({
          messages: (old?.messages || []).filter(msg => msg && !msg.id.startsWith('temp-')),
        }));
        return;
      }

      queryClient.setQueryData<{ messages: Message[] }>(["/api/messages"], (old) => {
        const currentMessages = (old?.messages || []).filter(Boolean);
        return { 
          messages: [...currentMessages, aiMessage] 
        };
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      
      setTimeout(() => scrollToBottom(), 50);
    },
    onError: (error: Error) => {
      queryClient.setQueryData<{ messages: Message[] }>(["/api/messages"], (old) => ({
        messages: (old?.messages || []).filter(msg => msg && !msg.id.startsWith('temp-')),
      }));
      
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearMessagesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/messages");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Chat cleared",
        description: "All messages have been deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear messages.",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? "smooth" : "auto" 
    });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom && messages.length > 0);
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const hasRealMessages = messages.some(m => m && !m.id.startsWith('temp-'));

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 h-16 flex items-center justify-between px-4">
        <div className="flex-1" />
        <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-app-title">
          Chicho AI
        </h1>
        <div className="flex-1 flex justify-end">
          {hasRealMessages && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => clearMessagesMutation.mutate()}
              disabled={clearMessagesMutation.isPending}
              data-testid="button-clear-chat"
              aria-label="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      <main
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain px-4 md:px-6"
        aria-label="Chat messages"
        data-testid="container-messages"
      >
        <div className="max-w-4xl mx-auto py-6">
          {isLoading && (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-muted-foreground">Loading messages...</div>
            </div>
          )}

          {!isLoading && messages.length === 0 && !sendMessageMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2" data-testid="text-welcome">
                  Hi! I'm Chicho AI
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Ask me anything and I'll do my best to help you.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend("Tell me a fun fact")}
                  className="rounded-full"
                  data-testid="button-suggestion-1"
                >
                  Tell me a fun fact
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend("Explain quantum computing")}
                  className="rounded-full"
                  data-testid="button-suggestion-2"
                >
                  Explain quantum computing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend("Write a short poem")}
                  className="rounded-full"
                  data-testid="button-suggestion-3"
                >
                  Write a short poem
                </Button>
              </div>
            </div>
          )}

          {!isLoading && messages.length > 0 && (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {sendMessageMutation.isPending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {showScrollButton && (
        <Button
          size="icon"
          variant="secondary"
          className="fixed bottom-24 right-4 md:right-8 rounded-full shadow-lg z-40"
          onClick={() => scrollToBottom()}
          data-testid="button-scroll-bottom"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}

      <ChatInput onSend={handleSend} disabled={sendMessageMutation.isPending} />
    </div>
  );
}
