/* eslint-disable prettier/prettier */
import settingsStore from '@/features/stores/settings'
import { useRef, useEffect, useState } from 'react'
import { Markdown } from './Markdown'
import { XMarkIcon } from '@heroicons/react/24/outline'

export const AssistantText = ({ message }: { message: string }) => {
  const characterName = settingsStore((s) => s.characterName)
  const showCharacterName = settingsStore((s) => s.showCharacterName)
  const contentRef = useRef<HTMLDivElement>(null)
  const [needsScroll, setNeedsScroll] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      setNeedsScroll(contentRef.current.scrollHeight > 200)
    }
  }, [message])

  useEffect(() => {
    setIsVisible(true)
  }, [message])

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 left-0 md:mb-[96px] mb-[80px] w-full z-10">
      <div className="mx-auto max-w-4xl w-full p-16">
        <div
          className="bg-white rounded-8 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={() => setIsVisible(false)}
            style={{
              right: '8px',
              top: '8px',
              position: 'absolute',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out'
            }}
            className="w-[24px] h-[24px] bg-secondary hover:bg-secondary-hover active:bg-secondary-press rounded-full flex items-center justify-center z-20 p-0"
          >
            <XMarkIcon className="text-white" />
          </button>

          {showCharacterName && (
            <div className="px-24 py-8 bg-secondary rounded-t-8 text-white font-bold tracking-wider">
              {characterName}
            </div>
          )}
          <div className="px-24 py-16 pb-20">
            <div
              ref={contentRef}
              className={`max-h-[150px] pb-1 ${needsScroll ? 'overflow-y-auto' : 'overflow-visible'
                } text-secondary typography-16 font-bold leading-loose`}
            >
              <Markdown content={message} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
