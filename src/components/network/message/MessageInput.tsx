
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
}

export function MessageInput({ onSendMessage, isSending }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { t } = useLanguage();

  const handleSend = async () => {
    if (!message.trim()) return;
    
    await onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="flex space-x-2">
      <Textarea
        placeholder={t('typeMessage')}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        className="flex-1"
        disabled={isSending}
      />
      <Button 
        onClick={handleSend} 
        disabled={isSending || !message.trim()}
        className="bg-easyroi-navy hover:bg-easyroi-navy/90"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
