import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import homeStore from '@/features/stores/home'
import settingsStore from '@/features/stores/settings'
import slideStore from '@/features/stores/slide'
import { IconButton } from './iconButton'

type Props = {
  userMessage: string
  isMicRecording: boolean
  selectedImages: string[]
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onClickSendButton: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClickMicButton: (event: React.MouseEvent<HTMLButtonElement>) => void
  onFileSelect: (files: FileList) => void
  onRemoveImage: (index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export const MessageInput = ({
  userMessage,
  isMicRecording,
  selectedImages,
  onChangeUserMessage,
  onClickMicButton,
  onClickSendButton,
  onFileSelect,
  onRemoveImage,
  fileInputRef,
}: Props) => {
  const chatProcessing = homeStore((s) => s.chatProcessing)
  const slidePlaying = slideStore((s) => s.isPlaying)
  const [rows, setRows] = useState(1)
  const [loadingDots, setLoadingDots] = useState('')
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const realtimeAPIMode = settingsStore((s) => s.realtimeAPIMode)
  const mediaInputMode = settingsStore((s) => s.mediaInputMode)

  const { t } = useTranslation()

  useEffect(() => {
    if (chatProcessing) {
      const interval = setInterval(() => {
        setLoadingDots((prev) => {
          if (prev === '...') return ''
          return prev + '.'
        })
      }, 200)

      return () => clearInterval(interval)
    } else {
      if (textareaRef.current) {
        textareaRef.current.value = ''
        const isTouchDevice = () => {
          if (typeof window === 'undefined') return false
          return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            // @ts-expect-error: msMaxTouchPoints is IE-specific
            navigator.msMaxTouchPoints > 0
          )
        }
        if (!isTouchDevice()) {
          textareaRef.current.focus()
        }
      }
    }
  }, [chatProcessing])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      !event.nativeEvent.isComposing &&
      event.keyCode !== 229 && // IME (Input Method Editor)
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault() // デフォルトの挙動を防止
      if (userMessage.trim() !== '') {
        onClickSendButton(
          event as unknown as React.MouseEvent<HTMLButtonElement>
        )
        setRows(1)
      }
    } else if (event.key === 'Enter' && event.shiftKey) {
      setRows(rows + 1)
    } else if (
      event.key === 'Backspace' &&
      rows > 1 &&
      userMessage.slice(-1) === '\n'
    ) {
      setRows(rows - 1)
    }
  }

  const handleMicClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClickMicButton(event)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onFileSelect(files)
    }
  }

  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (index: number) => {
    onRemoveImage(index)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="absolute bottom-0 z-20 w-screen">
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface1 p-24 rounded-16 max-w-md">
            <h3 className="typography-20 font-bold mb-16">
              {t('MicrophonePermission')}
            </h3>
            <p className="mb-16">{t('MicrophonePermissionMessage')}</p>
            <button
              className="bg-secondary hover:bg-secondary-hover px-16 py-8 rounded-8"
              onClick={() => setShowPermissionModal(false)}
            >
              {t('Close')}
            </button>
          </div>
        </div>
      )}
      {selectedImages.length > 0 && (
        <div className="mx-auto max-w-4xl px-16 pb-8">
          <div className="flex flex-wrap max-h-[200px] overflow-y-auto">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <div
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-[12px] right-[22px] z-50 cursor-pointer shrink-0 bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled rounded-16 p-1.5"
                  style={{ transform: 'translateZ(1px)' }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="h-[180px] w-[180px] object-cover rounded-16 mx-16 my-4"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-base text-black">
        <div className="mx-auto max-w-4xl p-16">
          <div className="flex gap-[8px] items-center w-full">
            {mediaInputMode && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <IconButton
                  iconName="24/Add"
                  className="w-[40px] h-[40px] shrink-0 bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
                  disabled={chatProcessing}
                  onClick={handleAddClick}
                  isProcessing={false}
                />
              </>
            )}
            <IconButton
              iconName="24/Microphone"
              className="w-[40px] h-[40px] shrink-0 bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isMicRecording}
              isProcessingIcon={'24/PauseAlt'}
              disabled={chatProcessing}
              onClick={handleMicClick}
            />
            <textarea
              ref={textareaRef}
              placeholder={
                chatProcessing
                  ? `${t('AnswerGenerating')}${loadingDots}`
                  : t('EnterYourQuestion')
              }
              onChange={onChangeUserMessage}
              onKeyDown={handleKeyPress}
              disabled={chatProcessing || slidePlaying || realtimeAPIMode}
              className="flex-1 min-w-0 max-h-[200px] overflow-y-auto bg-surface1 hover:bg-surface1-hover focus:bg-surface1 disabled:bg-surface1-disabled disabled:text-primary-disabled rounded-16 text-text-primary typography-16 font-bold"
              value={userMessage}
              rows={rows}
              style={{ lineHeight: '1.5', padding: '8px 16px', resize: 'none' }}
            />
            <IconButton
              iconName="24/Send"
              className="w-[40px] h-[40px] shrink-0 bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={chatProcessing}
              disabled={chatProcessing || !userMessage || realtimeAPIMode}
              onClick={onClickSendButton}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
