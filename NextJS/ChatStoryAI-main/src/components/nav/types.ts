export interface NavItem {
  to?: string
  text: string
  items?: {
    icon?: {
      dark: string
      light: string
    }
    text: string
    description?: string
    to: string
  }[]
} 