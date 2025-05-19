import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    avatar: string
    remember?: boolean
    hasBadge?: boolean
  }
  
  interface Session {
    user: User & {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
} 