
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface UserAvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ src, name, size = 'md', className }: UserAvatarProps) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      case 'md':
      default: return 'h-10 w-10';
    }
  };

  const getFallbackText = () => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <Avatar className={`${getSizeClass()} ${className || ''}`}>
      <AvatarImage src={src} />
      <AvatarFallback>
        {getFallbackText()}
      </AvatarFallback>
    </Avatar>
  );
}
