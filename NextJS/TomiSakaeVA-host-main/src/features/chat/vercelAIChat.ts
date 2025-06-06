import { Message } from '../messages/messages'
import i18next from 'i18next'
import settingsStore, {
  multiModalAIServiceKey,
  multiModalAIServices,
} from '@/features/stores/settings'
import toastStore from '@/features/stores/toast'

const getAIConfig = () => {
  const ss = settingsStore.getState()
  const aiService = ss.selectAIService as multiModalAIServiceKey

  const apiKeyName = `${aiService}Key` as const
  const apiKey = ss[apiKeyName]

  return {
    aiApiKey: apiKey,
    selectAIService: aiService,
    selectAIModel: ss.selectAIModel,
    azureEndpoint: ss.azureEndpoint,
    useSearchGrounding: ss.useSearchGrounding,
  }
}

function handleApiError(errorCode: string): string {
  const languageCode = settingsStore.getState().selectLanguage
  i18next.changeLanguage(languageCode)
  return i18next.t(`Errors.${errorCode || 'AIAPIError'}`)
}

export async function getVercelAIChatResponse(messages: Message[]) {
  const {
    aiApiKey,
    selectAIService,
    selectAIModel,
    azureEndpoint,
    useSearchGrounding,
  } = getAIConfig()

  if (messages.length > 0 && messages[0].role === 'system') {
    const ss = settingsStore.getState()
    messages[0].content = `You are ${ss.characterName}. ${messages[0].content}`
  }

  try {
    const response = await fetch('/api/aiChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        apiKey: aiApiKey,
        aiService: selectAIService,
        model: selectAIModel,
        azureEndpoint: azureEndpoint,
        stream: false,
        useSearchGrounding: useSearchGrounding,
      }),
    })

    if (!response.ok) {
      const responseBody = await response.json()
      throw new Error(
        `API request to ${selectAIService} failed with status ${response.status} and body ${responseBody.error}`,
        { cause: { errorCode: responseBody.errorCode } }
      )
    }

    const data = await response.json()
    return { text: data.text }
  } catch (error: any) {
    console.error(`Error fetching ${selectAIService} API response:`, error)
    const errorCode = error.cause?.errorCode || 'AIAPIError'
    return { text: handleApiError(errorCode) }
  }
}

export async function getVercelAIChatResponseStream(
  messages: Message[]
): Promise<ReadableStream<string>> {
  const {
    aiApiKey,
    selectAIService,
    selectAIModel,
    azureEndpoint,
    useSearchGrounding,
  } = getAIConfig()

  const processedMessages = messages.map((msg) => {
    if (Array.isArray(msg.content)) {
      return {
        ...msg,
        content: msg.content.map((part) => {
          if (part.type === 'image') {
            return {
              type: 'image_url',
              image_url: {
                url: part.image,
              },
            }
          }
          return part
        }),
      }
    }
    return msg
  })

  if (processedMessages.length > 0 && processedMessages[0].role === 'system') {
    const ss = settingsStore.getState()
    processedMessages[0].content = `You are ${ss.characterName}. ${processedMessages[0].content}`
  }

  const response = await fetch('/api/aiChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: processedMessages,
      apiKey: aiApiKey,
      aiService: selectAIService,
      model: selectAIModel,
      azureEndpoint: azureEndpoint,
      stream: true,
      useSearchGrounding: useSearchGrounding,
    }),
  })

  try {
    if (!response.ok) {
      const responseBody = await response.json()
      throw new Error(
        `API request to ${selectAIService} failed with status ${response.status} and body ${responseBody.error}`,
        { cause: { errorCode: responseBody.errorCode } }
      )
    }

    return new ReadableStream({
      async start(controller) {
        if (!response.body) {
          throw new Error(
            `API response from ${selectAIService} is empty, status ${response.status}`,
            { cause: { errorCode: 'AIAPIError' } }
          )
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              if (line.startsWith('0:')) {
                const content = line.substring(2).trim()
                const decodedContent = JSON.parse(content)
                controller.enqueue(decodedContent)
              }
            }
          }
        } catch (error) {
          console.error(
            `Error fetching ${selectAIService} API response:`,
            error
          )

          const errorMessage = handleApiError('AIAPIError')
          toastStore.getState().addToast({
            message: errorMessage,
            type: 'error',
            tag: 'vercel-api-error',
          })
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })
  } catch (error: any) {
    const errorMessage = handleApiError(error.cause.errorCode)
    toastStore.getState().addToast({
      message: errorMessage,
      type: 'error',
      tag: 'vercel-api-error',
    })
    throw error
  }
}
