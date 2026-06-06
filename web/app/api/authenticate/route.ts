import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import { extractFirstJson } from '@/lib/extract-json'
import type { AuthResult, ImagePayload } from '@/types/auth'

export const maxDuration = 60

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
  if (images.length > 8) {
    return NextResponse.json({ error: 'Maximum 8 images allowed' }, { status: 400 })
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
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            { type: 'text', text: `Authenticate this sneaker: ${productName}` },
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

  let result: AuthResult
  try {
    result = JSON.parse(jsonStr) as AuthResult
  } catch {
    return NextResponse.json({ error: 'Failed to parse model response', raw: rawText }, { status: 500 })
  }

  // Safety net: enforce confidence cap
  if (result.confidence > 95) result.confidence = 95

  // Safety net: a verdict with fewer than 4 named checks is not trustworthy —
  // return Inconclusive rather than surfacing a thin result
  if (result.verdict !== 'Inconclusive' && (!result.checks || result.checks.length < 4)) {
    return NextResponse.json({
      verdict: 'Inconclusive',
      confidence: 0,
      confidence_note: 'Authentication could not be completed — insufficient checks were returned. Please try again.',
      checks: result.checks ?? [],
      next_step: 'Please try again. If this keeps happening, try uploading clearer photos.',
    } satisfies AuthResult)
  }

  return NextResponse.json(result)
}
