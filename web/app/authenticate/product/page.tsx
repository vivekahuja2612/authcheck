'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

const KNOWN_KEYWORDS = [
  'jordan', 'dunk', 'air force', 'yeezy', 'air max 90', 'air max 95', 'air max 97', 'ultraboost', 'phantom gx',
  'stan smith', 'superstar', 'chuck taylor', 'converse', 'vans old skool',
  'vans sk8', 'new balance', 'reebok', 'puma suede', 'gel-kayano', 'gel-nimbus',
  'react infinity', 'sb dunk',
]

function isKnownModel(name: string): boolean {
  const lower = name.toLowerCase()
  return KNOWN_KEYWORDS.some((kw) => lower.includes(kw))
}

export default function ProductPage() {
  const router = useRouter()
  const { productName: savedName, setProductName } = useAuth()
  const [value, setValue] = useState(savedName)

  const trimmed = value.trim()
  const isUnknown = trimmed.length > 3 && !isKnownModel(trimmed)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!trimmed) return
    setProductName(trimmed)
    router.push('/authenticate/photos')
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
        What's the item?
      </h1>
      <p style={{ color: '#8A8A8A', margin: '0 0 32px', fontSize: '15px' }}>
        Be specific — include colorway name
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Nike Air Jordan 1 Retro High OG Chicago"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #E8E8E4',
              borderRadius: '8px',
              background: '#FFFFFF',
              color: '#111111',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {isUnknown && (
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#D4820A' }}>
              ⚠️ We don&apos;t have this model in our database yet — authentication confidence will be capped at 70%.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!trimmed}
          style={{
            background: trimmed ? '#111111' : '#E8E8E4',
            color: trimmed ? '#FFFFFF' : '#8A8A8A',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: trimmed ? 'pointer' : 'default',
            alignSelf: 'flex-start',
          }}
        >
          Continue
        </button>
      </form>
    </main>
  )
}
