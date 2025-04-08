
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getConversation, sendMessage, MessageData } from "@/services/network";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && investorId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [isOpen, investorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setIsSending(true);
      const success = await sendMessage(investorId, message.trim());
      
      if (success) {
        // Optimistically update UI
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newMessage: MessageData = {
            id: crypto.randomUUID(),
            sender_id: user.id,
            recipient_id: investorId,
            content: message.trim(),
            read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sender_name: 'You', // Will be replaced on next load
            recipient_name: investorName
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
          setMessage("");
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Recently";
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
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-easyroi-navy" />
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {t('noMessagesYet')}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const { data: { user } } = supabase.auth.getUser();
                    const isCurrentUser = user?.id === msg.sender_id;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? 'bg-easyroi-navy text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="text-sm">{msg.content}</div>
                          <div className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatMessageTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          )}
          
          <Separator className="my-4" />
          
          <div className="flex space-x-2">
            <Textarea
              placeholder={t('typeMessage')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
