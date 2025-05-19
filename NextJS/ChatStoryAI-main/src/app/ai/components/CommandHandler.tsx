/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner"
import { Message } from "@/lib/gemini-chat-config"
import { Story } from '../types'
import { createStory } from '../api/chatApi'

interface CommandHandlerProps {
  selectedStory: Story | null
  setCommandStatus: (status: 'loading' | 'success' | 'error' | null) => void
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  updateMessageStatus: (messageId: number, status: 'loading' | 'success' | 'error') => Promise<void>
}

export const useCommandHandler = ({
  selectedStory,
  setCommandStatus,
  messages,
  setMessages,
  updateMessageStatus
}: CommandHandlerProps) => {

  const handleCreateStory = async (params: {
    title: string
    description: string
    mainCategoryId: string
    tagIds: number[]
  }) => {
    try {
      setCommandStatus('loading')
      const response = await createStory(params)
      
      setCommandStatus('success')
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        if (lastMessage?.id) {
          await updateMessageStatus(lastMessage.id, 'success')
        }
        
        setMessages((prev: Message[]) => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg) {
            lastMsg.content = lastMsg.content.replace(
              /\/create-story\s*({[\s\S]*?})/,
              (match) => `${match}\n\n✅ Đã tạo truyện thành công!`
            )
            lastMsg.command_status = 'success'
          }
          return newMessages
        })
      }

      toast.success('Đã tạo truyện thành công!')
      
      // Dispatch event để ChatInput biết và fetch lại danh sách
      window.dispatchEvent(new CustomEvent('story-created', {
        detail: response.story // Giả sử API trả về thông tin truyện mới
      }))
      
    } catch (error) {
      console.error('Lỗi khi tạo truyện:', error)
      handleCommandError(error as Error, 'create-story')
    }
  }

  const handleCreateCharacter = async (params: {
    storyId: number
    name: string
    description: string
    role: 'main' | 'supporting'
    gender: string
    birthday: string
    height: string
    weight: string
    personality: string
    appearance: string
    background: string
  }) => {
    const formData = new FormData()
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    try {
      const response = await fetch(`/api/stories/${params.storyId}/characters`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Không thể tạo nhân vật')
      }

      toast.success('Đã tạo nhân vật thành công!')
    } catch (error) {
      console.error('Lỗi khi tạo nhân vật:', error)
      toast.error('Có lỗi xảy ra khi tạo nhân vật')
      throw error
    }
  }

  const handleCreateChapter = async (params: {
    title: string
    summary: string
    status: 'draft' | 'published'
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi tạo chương')
      throw new Error('Không có truyện được chọn')
    }

    try {
      const response = await fetch(`/api/stories/${selectedStory.story_id}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        throw new Error('Không thể tạo chương mới')
      }

      toast.success('Đã tạo chương mới thành công!')
    } catch (error) {
      console.error('Lỗi khi tạo chương:', error)
      toast.error('Có lỗi xảy ra khi tạo chương')
      throw error
    }
  }

  const handleCreateOutline = async (params: {
    title: string
    description: string
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi tạo đại cương')
      throw new Error('Không có truyện được chọn')
    }

    try {
      const response = await fetch(`/api/stories/${selectedStory.story_id}/outlines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        throw new Error('Không thể tạo đại cương mới')
      }

      toast.success('Đã tạo đại cương mới thành công!')
    } catch (error) {
      console.error('Lỗi khi tạo đại cương:', error)
      toast.error('Có lỗi xảy ra khi tạo đại cương')
      throw error
    }
  }

  const handleEditStory = async (params: {
    title: string
    description: string
    mainCategoryId: string
    tagIds: number[]
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi sửa')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const formData = new FormData()
      formData.append('title', params.title)
      formData.append('description', params.description)
      formData.append('mainCategoryId', params.mainCategoryId)
      formData.append('tagIds', JSON.stringify(params.tagIds))

      const response = await fetch(`/api/stories/${selectedStory.story_id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Không thể cập nhật truyện')
      }

      setCommandStatus('success')
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.id) {
        await updateMessageStatus(lastMessage.id, 'success')
      }

      setMessages((prev: Message[]) => {
        const newMessages = [...prev]
        const lastMsg = newMessages[newMessages.length - 1]
        if (lastMsg) {
          lastMsg.content = lastMsg.content.replace(
            /\/edit-story\s*({[\s\S]*?})/,
            (match) => `${match}\n\n✅ Đã cập nhật truyện thành công!`
          )
          lastMsg.command_status = 'success'
        }
        return newMessages
      })

      toast.success('Đã cập nhật truyện thành công!')
      
      // Dispatch event để ChatInput biết và fetch lại danh sách
      window.dispatchEvent(new CustomEvent('story-created'))
      } catch (error) {
      console.error('Lỗi khi cập nhật truyện:', error)
      handleCommandError(error as Error, 'edit-story')
    }
  }

  const handleEditCharacter = async (params: {
    character_id: number
    name: string
    description: string
    role: 'main' | 'supporting'
    gender: string
    birthday: string
    height: string
    weight: string
    personality: string
    appearance: string
    background: string
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi sửa nhân vật')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const formData = new FormData()
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      const response = await fetch(`/api/stories/${selectedStory.story_id}/characters/${params.character_id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Không thể cập nhật nhân vật')
      }

      setCommandStatus('success')
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.id) {
        await updateMessageStatus(lastMessage.id, 'success')
      }

      setMessages((prev: Message[]) => {
        const newMessages = [...prev]
        const lastMsg = newMessages[newMessages.length - 1]
        if (lastMsg) {
          lastMsg.content = lastMsg.content.replace(
            /\/edit-character\s*({[\s\S]*?})/,
            (match) => `${match}\n\n✅ Đã cập nhật nhân vật thành công!`
          )
          lastMsg.command_status = 'success'
        }
        return newMessages
      })

      toast.success('Đã cập nhật nhân vật thành công!')
      window.dispatchEvent(new CustomEvent('character-updated'))
    } catch (error) {
      console.error('Lỗi khi cập nhật nhân vật:', error)
      handleCommandError(error as Error, 'edit-character')
    }
  }

  const handleEditChapter = async (params: {
    chapter_id: number
    title: string
    summary: string
    status: 'draft' | 'published'
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi sửa chương')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${selectedStory.story_id}/chapters/${params.chapter_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }
      )

      if (!response.ok) {
        throw new Error('Không thể cập nhật chương')
      }

      handleCommandSuccess('edit-chapter')
      window.dispatchEvent(new CustomEvent('chapter-updated'))
    } catch (error) {
      console.error('Lỗi khi cập nhật chương:', error)
      handleCommandError(error as Error, 'edit-chapter')
    }
  }

  const handleEditOutline = async (params: {
    outline_id: number
    title: string
    description: string
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi sửa đại cương')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${selectedStory.story_id}/outlines/${params.outline_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }
      )

      if (!response.ok) {
        throw new Error('Không thể cập nhật đại cương')
      }

      handleCommandSuccess('edit-outline')
      window.dispatchEvent(new CustomEvent('outline-updated'))
    } catch (error) {
      console.error('Lỗi khi cập nhật đại cương:', error)
      handleCommandError(error as Error, 'edit-outline')
    }
  }

  const handleDeleteCharacter = async (params: { character_id: number }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi xóa nhân vật')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${selectedStory.story_id}/characters/${params.character_id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Không thể xóa nhân vật')
      }

      handleCommandSuccess('delete-character')
      window.dispatchEvent(new CustomEvent('character-deleted'))
    } catch (error) {
      console.error('Lỗi khi xóa nhân vật:', error)
      handleCommandError(error as Error, 'delete-character')
    }
  }

  const handleDeleteChapter = async (params: { chapter_id: number }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi xóa chương')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${selectedStory.story_id}/chapters/${params.chapter_id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Không thể xóa chương')
      }

      handleCommandSuccess('delete-chapter')
      window.dispatchEvent(new CustomEvent('chapter-deleted'))
    } catch (error) {
      console.error('Lỗi khi xóa chương:', error)
      handleCommandError(error as Error, 'delete-chapter')
    }
  }

  const handleDeleteOutline = async (params: { outline_id: number }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi xóa đại cương')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${selectedStory.story_id}/outlines/${params.outline_id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Không thể xóa đại cương')
      }

      handleCommandSuccess('delete-outline')
      window.dispatchEvent(new CustomEvent('outline-deleted'))
    } catch (error) {
      console.error('Lỗi khi xóa đại cương:', error)
      handleCommandError(error as Error, 'delete-outline')
    }
  }

  const handleCreateDialogue = async (params: {
    chapter_id: number
    dialogues: Array<{
      character_id: number | null
      content: string
      type: 'dialogue' | 'aside'
      order_number: number
    }>
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi tạo hội thoại')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      
      // Lấy danh sách hội thoại hiện có của chương
      const existingDialoguesResponse = await fetch(
        `/api/stories/${selectedStory.story_id}/chapters/${params.chapter_id}/dialogues`
      )
      
      if (!existingDialoguesResponse.ok) {
        throw new Error('Không thể lấy danh sách hội thoại hiện có')
      }

      const { dialogues: existingDialogues } = await existingDialoguesResponse.json()
      
      // Lọc ra những dialogue chưa tồn tại
      const newDialogues = params.dialogues.filter(newDialogue => 
        !existingDialogues.some((existingDialogue: any) => 
          existingDialogue.content === newDialogue.content &&
          existingDialogue.character_id === newDialogue.character_id &&
          existingDialogue.type === newDialogue.type
        )
      )

      if (newDialogues.length === 0) {
        toast.info('Tất cả hội thoại đã tồn tại')
        setCommandStatus('success')
        return
      }

      // Thêm từng dialogue mới
      for (const dialogue of newDialogues) {
        const response = await fetch(
          `/api/stories/${selectedStory.story_id}/chapters/${params.chapter_id}/dialogues`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dialogue)
          }
        )

        if (!response.ok) {
          throw new Error('Không thể thêm hội thoại')
        }
      }

      // Cập nhật trạng thái thành công
      setCommandStatus('success')
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.id) {
        await updateMessageStatus(lastMessage.id, 'success')
      }

      // Cập nhật nội dung tin nhắn
      setMessages((prev: Message[]) => {
        const newMessages = [...prev]
        const lastMsg = newMessages[newMessages.length - 1]
        if (lastMsg) {
          lastMsg.content = lastMsg.content.replace(
            /\/create-dialogue\s*({[\s\S]*?})/,
            (match) => `${match}\n\n✅ Đã tạo ${newDialogues.length} hội thoại mới thành công!`
          )
          lastMsg.command_status = 'success'
        }
        return newMessages
      })

      toast.success(`Đã tạo ${newDialogues.length} hội thoại mới thành công!`)
      window.dispatchEvent(new CustomEvent('dialogues-created'))
    } catch (error) {
      console.error('Lỗi khi tạo hội thoại:', error)
      handleCommandError(error as Error, 'create-dialogue')
    }
  }

  const handleEditDialogue = async (params: {
    dialogue_id: number
    content: string
    type: 'dialogue' | 'aside'
    character_id: number | null
    chapter_id: number
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi sửa hội thoại')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${selectedStory.story_id}/chapters/${params.chapter_id}/dialogues/${params.dialogue_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: params.content,
            type: params.type,
            character_id: params.character_id
          })
        }
      )

      if (!response.ok) {
        throw new Error('Không thể cập nhật hội thoại')
      }

      handleCommandSuccess('edit-dialogue')
      window.dispatchEvent(new CustomEvent('dialogue-updated'))
    } catch (error) {
      console.error('Lỗi khi cập nhật hội thoại:', error)
      handleCommandError(error as Error, 'edit-dialogue')
    }
  }

  const handleDeleteDialogue = async (params: { 
    dialogue_id: number
    chapter_id: number 
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi xóa hội thoại')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${selectedStory.story_id}/chapters/${params.chapter_id}/dialogues/${params.dialogue_id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Không thể xóa hội thoại')
      }

      handleCommandSuccess('delete-dialogue')
      window.dispatchEvent(new CustomEvent('dialogue-deleted'))
    } catch (error) {
      console.error('Lỗi khi xóa hội thoại:', error)
      handleCommandError(error as Error, 'delete-dialogue')
    }
  }

  const handlePublishStory = async (params: { story_id: number }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi xuất bản')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${params.story_id}/publish`,
        { method: 'PUT' }
      )

      if (!response.ok) {
        throw new Error('Không thể xuất bản truyện')
      }

      handleCommandSuccess('publish-story')
      window.dispatchEvent(new CustomEvent('story-published'))
    } catch (error) {
      console.error('Lỗi khi xuất bản truyện:', error)
      handleCommandError(error as Error, 'publish-story')
    }
  }

  const handleDeleteStory = async (params: { story_id: number }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi xóa')
      throw new Error('Không có truyện được chọn')
    }

    try {
      setCommandStatus('loading')
      const response = await fetch(
        `/api/stories/${params.story_id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Không thể xóa truyện')
      }

      handleCommandSuccess('delete-story')
      window.dispatchEvent(new CustomEvent('story-deleted'))
    } catch (error) {
      console.error('Lỗi khi xóa truyện:', error)
      handleCommandError(error as Error, 'delete-story')
    }
  }

  const handleCommandError = async (error: Error, commandType: string) => {
    setCommandStatus('error')
    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
      if (lastMessage?.id) {
        await updateMessageStatus(lastMessage.id, 'error')
      }
      
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMsg = newMessages[newMessages.length - 1]
        if (lastMsg) {
          lastMsg.content = lastMsg.content.replace(
            new RegExp(`\\/${commandType}\\s*({[\\s\\S]*?})`),
            (match) => `${match}\n\n❌ Có lỗi xảy ra!`
          )
          lastMsg.command_status = 'error'
        }
        return newMessages
      })
    }
    
    toast.error(`Có lỗi xảy ra khi thực hiện lệnh ${commandType}`)
  }

  const handleCommandSuccess = (commandType: string) => {
    setCommandStatus('success')
    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
      if (lastMessage?.id) {
        updateMessageStatus(lastMessage.id, 'success')
      }
      
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMsg = newMessages[newMessages.length - 1]
        if (lastMsg) {
          lastMsg.content = lastMsg.content.replace(
            new RegExp(`\\/${commandType}\\s*({[\\s\\S]*?})`),
            (match) => `${match}\n\n✅ Thực hiện lệnh ${commandType} thành công!`
          )
          lastMsg.command_status = 'success'
        }
        return newMessages
      })
    }
    
    toast.success(`Thực hiện lệnh ${commandType} thành công!`)
  }

  return {
    handleCreateStory,
    handleCreateCharacter,
    handleCreateChapter,
    handleCreateOutline,
    handleEditStory,
    handleEditCharacter,
    handleEditChapter,
    handleEditOutline,
    handleDeleteCharacter,
    handleDeleteChapter,
    handleDeleteOutline,
    handleCreateDialogue,
    handleEditDialogue,
    handleDeleteDialogue,
    handlePublishStory,
    handleDeleteStory
  }
} 