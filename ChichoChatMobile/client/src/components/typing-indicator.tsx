export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mr-auto max-w-[85%]" data-testid="typing-indicator">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground px-1">Chicho AI</span>
        <div className="bg-accent text-accent-foreground rounded-2xl rounded-bl-sm px-4 py-3">
          <div className="flex items-center gap-1">
            <div 
              className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <div 
              className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
              style={{ animationDelay: "150ms", animationDuration: "1s" }}
            />
            <div 
              className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
              style={{ animationDelay: "300ms", animationDuration: "1s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
