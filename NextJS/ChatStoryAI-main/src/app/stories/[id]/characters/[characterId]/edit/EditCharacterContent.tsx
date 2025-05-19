/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera, ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IdeaGenerator } from "@/components/ai-generator/CharacterIdeaGenerator"
import { AvatarImagePrompt } from "@/components/ai-generator/AvatarImagePrompt"
import { useLoading } from "@/providers/loading-provider"

interface Character {
  character_id: number
  name: string
  description: string
  avatar_image: string
  role: 'main' | 'supporting'
  gender: string
  birthday: string
  height: string
  weight: string
  personality: string
  appearance: string
  background: string
}

export default function EditCharacterContent({ 
  storyId, 
  characterId 
}: { 
  storyId: string
  characterId: string 
}) {
  const router = useRouter()
  const { startLoading } = useLoading()
  const { data: session } = useSession()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [previewImage, setPreviewImage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [storyContext, setStoryContext] = useState<{
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  } | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      try {
        // Fetch character data
        const response = await fetch(`/api/stories/${storyId}/characters/${characterId}/get`)
        const data = await response.json()
        
        if (response.ok) {
          const formattedCharacter = {
            ...data.character,
            birthday: data.character.birthday ? new Date(data.character.birthday).toISOString().split('T')[0] : '',
            weight: data.character.weight?.toString() || '',
            height: data.character.height?.toString() || ''
          }
          setCharacter(formattedCharacter)
          if (formattedCharacter.avatar_image) {
            setPreviewImage(formattedCharacter.avatar_image)
          }
        } else {
          toast.error('Không thể tải thông tin nhân vật')
        }

        // Fetch story context
        const storyResponse = await fetch(`/api/stories/${storyId}`)
        if (storyResponse.ok) {
          const storyData = await storyResponse.json()
          setStoryContext({
            title: storyData.story.title,
            description: storyData.story.description,
            mainCategory: storyData.story.main_category,
            tags: storyData.story.tags
          })
        } else {
          throw new Error('Không thể lấy thông tin truyện')
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (session?.user) {
      fetchData()
    }
  }, [session, storyId, characterId])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setImageFile(file)
    }
  }

  const handleImageGenerated = (imageData: string) => {
    const byteString = atob(imageData);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
    
    setImageFile(file);
    setPreviewImage(`data:image/jpeg;base64,${imageData}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      if (imageFile) {
        formData.delete('avatarImage')
        formData.append('avatarImage', imageFile)
      }

      const response = await fetch(`/api/stories/${storyId}/characters/${characterId}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật nhân vật')
      }

      toast.success('Cập nhật nhân vật thành công!')
      startLoading(`/stories/${storyId}?tab=characters`)
      router.push(`/stories/${storyId}?tab=characters`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}/characters/${characterId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xóa nhân vật')
      }

      toast.success('Xóa nhân vật thành công!')
      startLoading(`/stories/${storyId}?tab=characters`)
      router.push(`/stories/${storyId}?tab=characters`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    }
  }

  const handleApplyIdea = (idea: any) => {
    if (!character) return;
    
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    const genderInput = document.querySelector('select[name="gender"]') as HTMLSelectElement;
    const birthdayInput = document.querySelector('input[name="birthday"]') as HTMLInputElement;
    const heightInput = document.querySelector('input[name="height"]') as HTMLInputElement;
    const weightInput = document.querySelector('input[name="weight"]') as HTMLInputElement;
    const personalityInput = document.querySelector('textarea[name="personality"]') as HTMLTextAreaElement;
    const appearanceInput = document.querySelector('textarea[name="appearance"]') as HTMLTextAreaElement;
    const backgroundInput = document.querySelector('textarea[name="background"]') as HTMLTextAreaElement;
    
    if (nameInput) nameInput.value = idea.name;
    if (descriptionInput) descriptionInput.value = idea.description;
    if (genderInput) genderInput.value = idea.gender;
    if (birthdayInput) birthdayInput.value = idea.birthday;
    if (heightInput) heightInput.value = idea.height;
    if (weightInput) weightInput.value = idea.weight;
    if (personalityInput) personalityInput.value = idea.personality;
    if (appearanceInput) appearanceInput.value = idea.appearance;
    if (backgroundInput) backgroundInput.value = idea.background;
  }

  if (isLoadingData) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Skeleton width={200} height={36} />
          <div className="flex flex-col sm:flex-row gap-2">
            <Skeleton width={120} height={36} />
            <Skeleton width={120} height={36} />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <Skeleton circle width={160} height={160} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton width={100} height={20} />
            <Skeleton height={40} className="mt-2" />
          </div>

          <div>
            <Skeleton width={80} height={20} />
            <Skeleton height={128} className="mt-2" />
          </div>

          <div>
            <Skeleton width={80} height={20} />
            <Skeleton height={40} className="mt-2" />
          </div>

          <div>
            <Skeleton width={100} height={20} />
            <Skeleton height={40} className="mt-2" />
          </div>

          <div>
            <Skeleton width={100} height={20} />
            <Skeleton height={40} className="mt-2" />
          </div>

          <div>
            <Skeleton width={100} height={20} />
            <Skeleton height={40} className="mt-2" />
          </div>

          <div>
            <Skeleton width={100} height={20} />
            <Skeleton height={128} className="mt-2" />
          </div>

          <div>
            <Skeleton width={100} height={20} />
            <Skeleton height={128} className="mt-2" />
          </div>

          <div>
            <Skeleton width={100} height={20} />
            <Skeleton height={128} className="mt-2" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
        </div>
      </div>
    )
  }

  if (!character || !storyContext) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Chỉnh sửa nhân vật
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <IdeaGenerator 
            role={character.role}
            storyContext={storyContext}
            onApplyIdea={handleApplyIdea}
            existingCharacter={{
              name: character.name,
              description: character.description,
              role: character.role,
              gender: character.gender,
              birthday: character.birthday,
              height: character.height,
              weight: character.weight,
              personality: character.personality,
              appearance: character.appearance,
              background: character.background
            }}
          />
          <AvatarImagePrompt
            characterInfo={{
              name: character.name,
              description: character.description,
              gender: character.gender,
              personality: character.personality,
              appearance: character.appearance,
              role: character.role
            }}
            onImageGenerated={handleImageGenerated}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center">
          <div 
            onClick={handleImageClick}
            className="relative cursor-pointer group mb-6"
          >
            <div className={`w-40 h-40 rounded-full overflow-hidden border-2 border-dashed
              ${previewImage ? 'border-transparent' : 'border-gray-300'}
              flex items-center justify-center bg-gray-50 hover:bg-gray-100
              transition-colors duration-200 relative`}
            >
              {previewImage ? (
                <Image 
                  src={previewImage} 
                  alt="Preview" 
                  fill
                  sizes="160px"
                  className="object-cover"
                  priority
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">
                {previewImage ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="avatarImage"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tên nhân vật</label>
            <Input 
              name="name" 
              required 
              defaultValue={character.name}
              placeholder="Nhập tên nhân vật"
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <Textarea 
              name="description" 
              defaultValue={character.description}
              placeholder="Mô tả về nhân vật"
              className="h-32 text-base resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giới tính</label>
            <select
              name="gender"
              className="mt-1 block w-full rounded-md border-gray-300"
              defaultValue={character.gender}
            >
              <option value="">Chọn giới tính</option>
              <option value="nam">Nam</option>
              <option value="nữ">Nữ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              className="mt-1 block w-full rounded-md border-gray-300"
              defaultValue={character.birthday}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chiều cao</label>
            <input
              type="text"
              name="height"
              placeholder="Nhập chiều cao (cm)"
              className="mt-1 block w-full rounded-md border-gray-300"
              defaultValue={character.height}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cân nặng</label>
            <input
              type="text"
              name="weight"
              placeholder="Nhập cân nặng (kg)"
              className="mt-1 block w-full rounded-md border-gray-300"
              defaultValue={character.weight}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tính cách</label>
            <Textarea 
              name="personality" 
              placeholder="Mô tả tính cách"
              className="h-32 text-base resize-none"
              defaultValue={character.personality}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngoại hình</label>
            <Textarea 
              name="appearance" 
              placeholder="Mô tả ngoại hình"
              className="h-32 text-base resize-none"
              defaultValue={character.appearance}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quá khứ</label>
            <Textarea 
              name="background" 
              placeholder="Thông tin về xuất thân, quá khứ"
              className="h-32 text-base resize-none"
              defaultValue={character.background}
            />
          </div>

          <input type="hidden" name="role" value={character.role} />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto sm:min-w-[120px]"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                type="button" 
                variant="destructive" 
                className="w-full sm:w-auto sm:min-w-[120px]"
              >
                Xóa nhân vật
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Nhân vật này sẽ bị xóa vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Xác nhận xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              startLoading(`/stories/${storyId}?tab=characters`)
              router.push(`/stories/${storyId}?tab=characters`)
            }}
            className="w-full sm:w-auto sm:min-w-[120px]"
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  )
} 