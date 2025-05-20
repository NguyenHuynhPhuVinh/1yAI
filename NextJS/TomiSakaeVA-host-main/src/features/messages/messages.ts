/* eslint-disable prettier/prettier */
export type Message = {
  role: string
  content?:
  | string
  | Array<
    | { type: 'text'; text: string }
    | { type: 'image'; image: string }
    | { type: 'image_url'; image_url: { url: string } }
  >
  audio?: { id: string }
  timestamp?: string
}

export type MessageContent = Message['content']

export const EMOTIONS = ['neutral', 'happy', 'angry', 'sad', 'relaxed'] as const
export type EmotionType = (typeof EMOTIONS)[number]

export type Talk = {
  emotion: EmotionType
  message: string
  buffer?: ArrayBuffer
}

export const splitSentence = (text: string): string[] => {
  const splitMessages = text.split(/(?<=[。．！？\n])/g)
  return splitMessages.filter((msg) => msg !== '')
}
