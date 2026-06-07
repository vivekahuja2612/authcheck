'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import type { AuthResult } from '@/types/auth'

export default function ProcessingPage() {
  const router = useRouter()
  const { productName, images, setProductName, setImages, setResult, setError } = useAuth()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const called = useRef(false)

  useEffect(() => {
    let activeProductName = productName
    let activeImages = images

    const pending = localStorage.getItem('authcheck_pending')
    if (pending) {
      try {
        const parsed = JSON.parse(pending)
        activeProductName = parsed.productName
        activeImages = parsed.images
        setProductName(parsed.productName)
        setImages(parsed.images)
      } catch { /* malformed — ignore */ }
      localStorage.removeItem('authcheck_pending')
    }

    if (!activeProductName || activeImages.length === 0) {
      router.replace('/authenticate/product')
      return
    }
    if (called.current) return
    called.current = true

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    fetch('/api/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: activeProductName, images: activeImages }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Authentication failed')
        setResult(data as AuthResult)
        router.push('/authenticate/result')
      })
      .catch((err) => {
        const msg =
          err instanceof Error && err.name === 'AbortError'
            ? 'Analysis timed out'
            : err instanceof Error
            ? err.message
            : 'Something went wrong'
        setErrorMsg(msg)
        setError(msg)
      })
      .finally(() => clearTimeout(timeout))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (errorMsg) {
    return (
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#111111', margin: '0 0 8px' }}>
          Something went wrong. Your photos were not analyzed.
        </p>
        <p style={{ fontSize: '14px', color: '#8A8A8A', margin: '0 0 8px' }}>{errorMsg}</p>
        <p style={{ fontSize: '13px', color: '#8A8A8A', margin: '0 0 32px' }}>No charge if analysis failed.</p>
        <button
          onClick={() => router.push('/authenticate/photos')}
          style={{
            background: '#111111',
            color: '#FFFFFF',
            padding: '13px 28px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
      {/* Pulsing monogram circle */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 28px',
        animation: 'authPulse 1.6s ease-in-out infinite',
      }}>
        <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '28px', letterSpacing: '-1px' }}>A</span>
      </div>

      <p style={{ fontSize: '20px', fontWeight: 600, color: '#111111', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
        Analyzing your {productName}...
      </p>
      <p style={{ fontSize: '14px', color: '#8A8A8A', margin: 0 }}>
        Checking authentication markers
      </p>

      <style>{`
        @keyframes authPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.88); }
        }
      `}</style>
    </main>
  )
}
