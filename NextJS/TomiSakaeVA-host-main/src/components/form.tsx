import { useCallback, useEffect, useState } from 'react'
import settingsStore from '@/features/stores/settings'
import homeStore from '@/features/stores/home'
import menuStore from '@/features/stores/menu'
import slideStore from '@/features/stores/slide'
import { handleSendChatFn } from '../features/chat/handlers'
import { MessageInputContainer } from './messageInputContainer'
import { SlideText } from './slideText'

export const Form = () => {
  const modalImage = homeStore((s) => s.modalImage)
  const webcamStatus = homeStore((s) => s.webcamStatus)
  const captureStatus = homeStore((s) => s.captureStatus)
  const slideMode = settingsStore((s) => s.slideMode)
  const slideVisible = menuStore((s) => s.slideVisible)
  const slidePlaying = slideStore((s) => s.isPlaying)
  const chatProcessingCount = homeStore((s) => s.chatProcessingCount)
  const [delayedText, setDelayedText] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const handleSendChat = handleSendChatFn()

  useEffect(() => {
    // Gửi chat khi có text và ảnh
    if (delayedText && modalImage) {
      handleSendChat(delayedText, [modalImage])
      setDelayedText('')
      homeStore.setState({ modalImage: undefined })
    }
  }, [modalImage, delayedText, handleSendChat])

  const hookSendChat = useCallback(
    (text: string, images?: string[]) => {
      if (images?.length) {
        // Chỉ gửi khi có ảnh từ input
        handleSendChat(text, images)
      } else if (!homeStore.getState().modalImage) {
        if (webcamStatus || captureStatus) {
          setDelayedText(text) // Đợi ảnh từ webcam
        } else {
          handleSendChat(text) // Gửi khi không có ảnh
        }
      }
    },
    [handleSendChat, webcamStatus, captureStatus]
  )

  return slideMode &&
    slideVisible &&
    (slidePlaying || chatProcessingCount !== 0) ? (
    <SlideText />
  ) : (
    <MessageInputContainer onChatProcessStart={hookSendChat} />
  )
}
