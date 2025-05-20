/* eslint-disable prettier/prettier */
import { Message } from '@/features/messages/messages'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createCohere } from '@ai-sdk/cohere'
import { createMistral } from '@ai-sdk/mistral'
import { createAzure } from '@ai-sdk/azure'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { streamText, generateText, CoreMessage } from 'ai'
import { NextRequest } from 'next/server'
import { GoogleGenerativeAI, Part } from '@google/generative-ai'

type AIServiceKey =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure'
  | 'groq'
  | 'cohere'
  | 'mistralai'
  | 'perplexity'
  | 'fireworks'
  | 'deepseek'
type AIServiceConfig = Record<AIServiceKey, () => any>

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export const config = {
  runtime: 'edge',
}

type MessagePart = {
  text?: string;
  inlineData?: {
    data: string;
    mimeType: string;
  };
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method Not Allowed',
        errorCode: 'METHOD_NOT_ALLOWED',
      }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  // Log request body
  const body = await req.json()
  console.log('API Request body:', body)

  const {
    messages,
    apiKey,
    aiService,
    model,
    azureEndpoint,
    stream,
    useSearchGrounding,
  } = body

  // Log messages array
  console.log('Messages received:', messages)

  let aiApiKey = apiKey
  if (!aiApiKey) {
    const envKey = `${aiService.toUpperCase()}_KEY` as keyof typeof process.env
    const envApiKey = process.env[envKey]

    aiApiKey = envApiKey
  }

  if (!aiApiKey) {
    return new Response(
      JSON.stringify({ error: 'Empty API Key', errorCode: 'EmptyAPIKey' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  let modifiedAzureEndpoint = (
    azureEndpoint ||
    process.env.AZURE_ENDPOINT ||
    ''
  ).replace(/^https:\/\/|\.openai\.azure\.com.*$/g, '')
  let modifiedAzureDeployment =
    (azureEndpoint || process.env.AZURE_ENDPOINT || '').match(
      /\/deployments\/([^\/]+)/
    )?.[1] || ''
  let modifiedModel = aiService === 'azure' ? modifiedAzureDeployment : model

  if (!aiService || !modifiedModel) {
    return new Response(
      JSON.stringify({
        error: 'Invalid AI service or model',
        errorCode: 'AIInvalidProperty',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const aiServiceConfig: AIServiceConfig = {
    openai: () => createOpenAI({ apiKey: aiApiKey }),
    anthropic: () => createAnthropic({ apiKey: aiApiKey }),
    google: () => createGoogleGenerativeAI({ apiKey: aiApiKey }),
    azure: () =>
      createAzure({
        resourceName: modifiedAzureEndpoint,
        apiKey: aiApiKey,
      }),
    groq: () =>
      createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: aiApiKey,
      }),
    cohere: () => createCohere({ apiKey: aiApiKey }),
    mistralai: () => createMistral({ apiKey: aiApiKey }),
    perplexity: () =>
      createOpenAI({ baseURL: 'https://api.perplexity.ai/', apiKey: aiApiKey }),
    fireworks: () =>
      createOpenAI({
        baseURL: 'https://api.fireworks.ai/inference/v1',
        apiKey: aiApiKey,
      }),
    deepseek: () => createDeepSeek({ apiKey: aiApiKey }),
  }
  const aiServiceInstance = aiServiceConfig[aiService as AIServiceKey]

  if (!aiServiceInstance) {
    return new Response(
      JSON.stringify({
        error: 'Invalid AI service',
        errorCode: 'InvalidAIService',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const instance = aiServiceInstance()
  const modifiedMessages: Message[] = modifyMessages(aiService, messages)

  const isUseSearchGrounding = aiService === 'google' && useSearchGrounding
  const options = isUseSearchGrounding ? { useSearchGrounding: true } : {}
  console.log('options', options)

  // Xử lý đặc biệt cho Gemini khi có ảnh
  if (aiService === 'google') {
    const lastMessage = messages[messages.length - 1]

    if (Array.isArray(lastMessage.content)) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })

        const chatHistory = messages
          .filter((msg: Message) => msg.role !== 'system')
          .slice(0, -1)
          .reduce((acc: Message[], msg: Message) => {
            if (acc.length === 0 && msg.role === 'assistant') {
              return acc;
            }
            return [...acc, {
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content as string }]
            }];
          }, []);

        const chat = model.startChat({
          history: chatHistory
        })

        // Xử lý nhiều ảnh
        const messageParts: Part[] = [{ text: lastMessage.content[0].text }]

        // Lọc ra các phần tử có image_url và thêm vào messageParts
        lastMessage.content.forEach((content: any) => {
          if (content.image_url) {
            messageParts.push({
              inlineData: {
                data: content.image_url.url.split(',')[1],
                mimeType: 'image/jpeg'
              }
            } as Part)
          }
        })

        const result = await chat.sendMessage(messageParts)
        const response = await result.response
        const text = response.text()

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          async start(controller) {
            controller.enqueue(encoder.encode(`0: ${JSON.stringify(text)}\n`))
            controller.close()
          }
        })

        return new Response(stream)

      } catch (error) {
        console.error('Gemini API error:', error)
        return new Response(
          JSON.stringify({
            error: 'Gemini API Error',
            errorCode: 'AIAPIError'
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }
  }

  try {
    if (stream) {
      const result = await streamText({
        model: instance(modifiedModel, options),
        messages: modifiedMessages as CoreMessage[],
      })

      return result.toDataStreamResponse()
    } else {
      const result = await generateText({
        model: instance(model),
        messages: modifiedMessages as CoreMessage[],
      })

      return new Response(JSON.stringify({ text: result.text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('Error in AI API call:', error)

    return new Response(
      JSON.stringify({
        error: 'Unexpected Error',
        errorCode: 'AIAPIError',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

function modifyMessages(aiService: string, messages: Message[]): Message[] {
  if (aiService === 'anthropic' || aiService === 'perplexity') {
    return modifyAnthropicMessages(messages)
  }
  return messages
}

// Anthropicのメッセージを修正する
function modifyAnthropicMessages(messages: Message[]): Message[] {
  const systemMessage: Message | undefined = messages.find(
    (message) => message.role === 'system'
  )
  let userMessages = messages
    .filter((message) => message.role !== 'system')
    .filter((message) => message.content !== '')

  userMessages = consolidateMessages(userMessages)

  while (userMessages.length > 0 && userMessages[0].role !== 'user') {
    userMessages.shift()
  }

  const result: Message[] = systemMessage
    ? [systemMessage, ...userMessages]
    : userMessages
  return result
}

// 同じroleのメッセージを結合する
function consolidateMessages(messages: Message[]) {
  const consolidated: Message[] = []
  let lastRole: string | null = null
  let combinedContent:
    | string
    | Array<
      | { type: 'text'; text: string }
      | { type: 'image'; image: string }
      | { type: 'image_url'; image_url: { url: string } }
    >

  messages.forEach((message, index) => {
    if (message.role === lastRole) {
      if (typeof combinedContent === 'string') {
        combinedContent += '\n' + message.content
      } else {
        if (Array.isArray(combinedContent) &&
          combinedContent[0]?.type === 'text') {
          combinedContent[0].text += '\n' + message.content
        }
      }
    } else {
      if (lastRole !== null) {
        consolidated.push({ role: lastRole, content: combinedContent })
      }
      lastRole = message.role
      combinedContent = message.content || ''
    }

    if (index === messages.length - 1) {
      consolidated.push({ role: lastRole, content: combinedContent })
    }
  })

  return consolidated
}
