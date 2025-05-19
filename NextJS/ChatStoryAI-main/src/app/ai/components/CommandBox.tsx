/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useEffect } from "react"

interface CommandBoxProps {
  command: string
  status: 'loading' | 'success' | 'error'
  params?: Record<string, any>
  categories?: { id: number; name: string }[]
  tags?: { id: number; name: string }[]
}

export function CommandBox({ command, status, params, categories, tags }: CommandBoxProps) {
  useEffect(() => {
    if (status === 'success') {
      // Kích hoạt event để fetch lại data khi command thực hiện thành công
      const event = new CustomEvent('command-executed', {
        detail: { command }
      });
      window.dispatchEvent(event);
    }
  }, [status, command]);

  const getCommandTitle = () => {
    switch (command) {
      case '/create-story':
        return {
          loading: 'Đang tạo truyện mới...',
          success: 'Đã tạo truyện thành công!',
          error: 'Có lỗi xảy ra khi tạo truyện!'
        }[status]
      case '/create-character':
        return {
          loading: 'Đang tạo nhân vật mới...',
          success: 'Đã tạo nhân vật thành công!',
          error: 'Có lỗi xảy ra khi tạo nhân vật!'
        }[status]
      case '/create-chapter':
        return {
          loading: 'Đang tạo chương mới...',
          success: 'Đã tạo chương thành công!',
          error: 'Có lỗi xảy ra khi tạo chương!'
        }[status]
      case '/create-outline':
        return {
          loading: 'Đang tạo đại cương mới...',
          success: 'Đã tạo đại cương thành công!',
          error: 'Có lỗi xảy ra khi tạo đại cương!'
        }[status]
      case '/edit-story':
        return {
          loading: 'Đang cập nhật truyện...',
          success: 'Đã cập nhật truyện thành công!',
          error: 'Có lỗi xảy ra khi cập nhật truyện!'
        }[status]
      case '/edit-character':
        return {
          loading: 'Đang cập nhật nhân vật...',
          success: 'Đã cập nhật nhân vật thành công!',
          error: 'Có lỗi xảy ra khi cập nhật nhân vật!'
        }[status]
      case '/edit-chapter':
        return {
          loading: 'Đang cập nhật chương...',
          success: 'Đã cập nhật chương thành công!',
          error: 'Có lỗi xảy ra khi cập nhật chương!'
        }[status]
      case '/edit-outline':
        return {
          loading: 'Đang cập nhật đại cương...',
          success: 'Đã cập nhật đại cương thành công!',
          error: 'Có lỗi xảy ra khi cập nhật đại cương!'
        }[status]
      case '/delete-character':
        return {
          loading: 'Đang xóa nhân vật...',
          success: 'Đã xóa nhân vật thành công!',
          error: 'Có lỗi xảy ra khi xóa nhân vật!'
        }[status]
      case '/delete-chapter':
        return {
          loading: 'Đang xóa chương...',
          success: 'Đã xóa chương thành công!',
          error: 'Có lỗi xảy ra khi xóa chương!'
        }[status]
      case '/delete-outline':
        return {
          loading: 'Đang xóa đại cương...',
          success: 'Đã xóa đại cương thành công!',
          error: 'Có lỗi xảy ra khi xóa đại cương!'
        }[status]
      case '/create-dialogue':
        return {
          loading: 'Đang tạo hội thoại...',
          success: 'Đã tạo hội thoại thành công!',
          error: 'Có lỗi xảy ra khi tạo hội thoại!'
        }[status]
      case '/edit-dialogue':
        return {
          loading: 'Đang cập nhật hội thoại...',
          success: 'Đã cập nhật hội thoại thành công!',
          error: 'Có lỗi xảy ra khi cập nhật hội thoại!'
        }[status]
      case '/delete-dialogue':
        return {
          loading: 'Đang xóa hội thoại...',
          success: 'Đã xóa hội thoại thành công!',
          error: 'Có lỗi xảy ra khi xóa hội thoại!'
        }[status]
      case '/publish-story':
        return {
          loading: 'Đang xuất bản truyện...',
          success: 'Đã xuất bản truyện thành công!',
          error: 'Có lỗi xảy ra khi xuất bản truyện!'
        }[status]
      case '/delete-story':
        return {
          loading: 'Đang xóa truyện...',
          success: 'Đã xóa truyện thành công!',
          error: 'Có lỗi xảy ra khi xóa truyện!'
        }[status]
      default:
        return 'Đang xử lý...'
    }
  }

  const getParamLabel = (key: string) => {
    const labels: Record<string, string> = {
      title: 'Tiêu đề',
      description: 'Mô tả',
      mainCategoryId: 'Thể loại chính',
      tagIds: 'Thẻ tag',
      name: 'Tên',
      role: 'Vai trò',
      gender: 'Giới tính',
      birthday: 'Ngày sinh',
      height: 'Chiều cao',
      weight: 'Cân nặng',
      personality: 'Tính cách',
      appearance: 'Ngoại hình',
      background: 'Quá khứ',
      summary: 'Tóm tắt',
      status: 'Trạng thái',
      character_id: 'ID nhân vật',
      chapter_id: 'ID chương',
      outline_id: 'ID đại cương',
      dialogues: 'Các đoạn hội thoại',
      content: 'Nội dung',
      type: 'Loại',
      order_number: 'Thứ tự',
      dialogue_id: 'ID hội thoại'
    }
    return labels[key] || key
  }

  const formatParamValue = (key: string, value: any) => {
    if (key === 'mainCategoryId' && categories) {
      const category = categories.find(c => c.id.toString() === value.toString())
      return category ? category.name : value
    }
    
    if (key === 'tagIds' && tags) {
      if (Array.isArray(value)) {
        return value.map(tagId => {
          const tag = tags.find(t => t.id.toString() === tagId.toString())
          return tag ? tag.name : tagId
        }).join(', ')
      }
      return value
    }

    if (key === 'status') {
      const statusMap: Record<string, string> = {
        'draft': 'Bản nháp',
        'published': 'Đã xuất bản'
      }
      return statusMap[value] || value
    }

    if (key === 'role') {
      const roleMap: Record<string, string> = {
        'main': 'Chính',
        'supporting': 'Phụ'
      }
      return roleMap[value] || value
    }

    // Xử lý đặc biệt cho dialogues
    if (key === 'dialogues' && Array.isArray(value)) {
      return value.map((dialogue, index) => (
        `Đoạn ${index + 1}: ${dialogue.type === 'dialogue' ? 'Hội thoại' : 'Mô tả'} - ${dialogue.content}`
      )).join('\n')
    }

    // Nếu là object, chuyển thành chuỗi JSON
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }

    return value
  }

  return (
    <div className="bg-secondary/50 rounded-lg p-4 my-2 space-y-2">
      <div className="flex items-center gap-2">
        {status === 'loading' && (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium">{getCommandTitle()}</span>
      </div>
      
      {params && (
        <div className={`text-sm space-y-1 ${
          status === 'success' ? 'text-green-600' :
          status === 'error' ? 'text-red-600' :
          'text-muted-foreground'
        }`}>
          {Object.entries(params).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium">{getParamLabel(key)}:</span>
              <span className="whitespace-pre-wrap">{formatParamValue(key, value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 