import { cn } from '@/lib/utils';

type TagProps = {
  tag: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Tag({ tag, isActive, onClick, className }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className
      )}
    >
      {tag}
    </button>
  );
}
