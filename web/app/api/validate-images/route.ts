import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { VALIDATION_PROMPT } from '@/lib/validation-prompt'
import { extractFirstJson } from '@/lib/extract-json'
import type { ValidationResponse, ImagePayload } from '@/types/auth'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface RequestBody {
  productName: string
  images: ImagePayload[]
}

export async function POST(req: NextRequest) {
  let body: RequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { productName, images } = body

  if (!productName?.trim()) {
    return NextResponse.json({ error: 'productName is required' }, { status: 400 })
  }
  if (!images || images.length === 0) {
    return NextResponse.json({ error: 'At least one image is required' }, { status: 400 })
  }

  const imageBlocks: Anthropic.ImageBlockParam[] = images.map((img) => ({
    type: 'image',
    source: {
      type: 'base64',
      media_type: img.mediaType,
      data: img.data,
    },
  }))

  let rawText: string
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: VALIDATION_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            {
              type: 'text',
              text: `Product name: ${productName}\nPlease validate these ${images.length} image(s).`,
            },
          ],
        },
      ],
    })

    rawText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Claude API error'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const jsonStr = extractFirstJson(rawText)
  if (!jsonStr) {
    return NextResponse.json({ error: 'Model did not return valid JSON', raw: rawText }, { status: 500 })
  }

  let result: ValidationResponse
  try {
    result = JSON.parse(jsonStr) as ValidationResponse
  } catch {
    return NextResponse.json({ error: 'Failed to parse validation response', raw: rawText }, { status: 500 })
  }

  return NextResponse.json(result)
}
