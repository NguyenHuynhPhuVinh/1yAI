import Image from 'next/image'
import clsx from 'clsx'
import { useSession } from "next-auth/react"

interface UserAvatarProps {
  size?: number;
  showName?: boolean;
  className?: string;
}

export const UserAvatar = ({ size = 32, showName = true, className }: UserAvatarProps) => {
  const { data: session } = useSession()

  if (!session?.user) return null

  const SupporterAvatarFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      {session.user.hasBadge && (
        <div className={clsx(
          "absolute -inset-[3px] rounded-full",
          "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
          "animate-gradient-xy",
          "opacity-90"
        )} />
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  )

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <SupporterAvatarFrame>
        <div 
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <Image 
            src={session.user.avatar || '/default-user.webp'} 
            alt="Avatar"
            fill
            sizes={`${size}px`}
            className="rounded-full object-cover"
            priority
          />
        </div>
      </SupporterAvatarFrame>
      {showName && (
        <span className="font-medium">{session.user.name}</span>
      )}
    </div>
  )
} 