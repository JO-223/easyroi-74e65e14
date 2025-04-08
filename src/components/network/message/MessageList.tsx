
import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { MessageItem } from "./MessageItem";
import { MessageData } from "@/services/network/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface MessageListProps {
  messages: MessageData[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  useEffect(() => {
    // Get the current user ID
    const fetchUserId = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data && data.user) {
          setCurrentUserId(data.user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    
    fetchUserId();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-easyroi-navy" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {t('noMessagesYet')}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <MessageItem 
            key={msg.id}
            content={msg.content}
            createdAt={msg.created_at}
            isCurrentUser={currentUserId === msg.sender_id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
