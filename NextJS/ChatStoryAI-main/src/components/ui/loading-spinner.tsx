import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-b-transparent",
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}

// Biến thể nhỏ gọn để sử dụng inline
export function LoadingSpinnerInline({ className, size = 'sm' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2'
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-b-transparent inline-block",
        sizeClasses[size],
        className
      )}
    />
  )
} 