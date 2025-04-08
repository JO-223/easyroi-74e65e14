
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface MessageItemProps {
  content: string;
  createdAt: string;
  isCurrentUser: boolean;
}

export function MessageItem({ content, createdAt, isCurrentUser }: MessageItemProps) {
  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-easyroi-navy text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="text-sm">{content}</div>
        <div className={`text-xs mt-1 ${
          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatMessageTime(createdAt)}
        </div>
      </div>
    </div>
  );
}
