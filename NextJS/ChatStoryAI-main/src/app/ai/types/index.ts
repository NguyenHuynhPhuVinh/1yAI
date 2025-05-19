export interface ChatHistory {
  chat_id: number
  title: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description: string
}

export interface Tag {
  id: number
  name: string
  description: string
}

export interface Story {
  story_id: number
  title: string
  main_category: string
  status: 'draft' | 'published' | 'archived'
} 