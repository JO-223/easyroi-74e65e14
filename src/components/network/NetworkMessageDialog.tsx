
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getConversation, sendMessage, MessageData } from "@/services/network";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./message/MessageList";
import { MessageInput } from "./message/MessageInput";

interface NetworkMessageDialogProps {
  investorId: string;
  investorName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NetworkMessageDialog({
  investorId,
  investorName,
  isOpen,
  onClose
}: NetworkMessageDialogProps) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && investorId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [isOpen, investorId]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const conversationData = await getConversation(investorId);
      setMessages(conversationData);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: t('error'),
        description: t('failedToLoadMessages'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent) return;
    
    try {
      setIsSending(true);
      const success = await sendMessage(investorId, messageContent);
      
      if (success) {
        // Optimistically update UI
        const userResponse = await supabase.auth.getUser();
        const user = userResponse.data.user;
        
        if (user) {
          const newMessage: MessageData = {
            id: crypto.randomUUID(),
            sender_id: user.id,
            recipient_id: investorId,
            content: messageContent,
            read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sender_name: 'You', // Will be replaced on next load
            recipient_name: investorName
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t('error'),
        description: t('failedToSendMessage'),
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('messagingWith')} {investorName}</DialogTitle>
          <DialogDescription>{t('messageExchangeDesc')}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col h-[400px]">
          <MessageList 
            messages={messages} 
            isLoading={isLoading} 
          />
          
          <Separator className="my-4" />
          
          <MessageInput 
            onSendMessage={handleSendMessage}
            isSending={isSending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
