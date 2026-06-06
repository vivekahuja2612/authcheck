'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import type { ImagePayload, ImageValidationResult, ValidationResponse } from '@/types/auth'

type MediaType = ImagePayload['mediaType']

const SLOT_LABELS = ['Front', 'Back', 'Left Side', 'Right Side', 'Sole', 'Tag / Barcode']

function toClaudeMediaType(raw: string): MediaType {
  const supported: MediaType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (supported.includes(raw as MediaType)) return raw as MediaType
  if (raw === 'image/jpg') return 'image/jpeg'
  return 'image/jpeg'
}

function readFileAsBase64(file: File): Promise<ImagePayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const commaIdx = dataUrl.indexOf(',')
      const data = dataUrl.slice(commaIdx + 1)
      const rawType = dataUrl.slice(0, commaIdx).replace('data:', '').replace(';base64', '')
      resolve({ data, mediaType: toClaudeMediaType(rawType) })
    }
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`))
    reader.readAsDataURL(file)
  })
}

function SlotIcon({ label }: { label: string }) {
  if (label === 'Sole') {
    return (
      <svg width="52" height="34" viewBox="0 0 52 34" fill="none" aria-hidden="true">
        <ellipse cx="26" cy="17" rx="22" ry="13" stroke="#D4D4D0" strokeWidth="1.5"/>
        <line x1="8" y1="17" x2="44" y2="17" stroke="#D4D4D0" strokeWidth="1"/>
        <line x1="10" y1="21" x2="42" y2="21" stroke="#D4D4D0" strokeWidth="1"/>
        <line x1="10" y1="13" x2="42" y2="13" stroke="#D4D4D0" strokeWidth="1"/>
        <line x1="14" y1="25" x2="38" y2="25" stroke="#D4D4D0" strokeWidth="1"/>
        <line x1="14" y1="9" x2="38" y2="9" stroke="#D4D4D0" strokeWidth="1"/>
      </svg>
    )
  }
  if (label === 'Tag / Barcode') {
    return (
      <svg width="44" height="34" viewBox="0 0 44 34" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="40" height="26" rx="3" stroke="#D4D4D0" strokeWidth="1.5"/>
        {[8, 12, 14, 18, 21, 25, 28, 32, 35].map((x, idx) => (
          <line key={idx} x1={x} y1="10" x2={x} y2="24" stroke="#D4D4D0" strokeWidth={idx % 3 === 0 ? 2.5 : 1}/>
        ))}
      </svg>
    )
  }
  // Side-profile shoe for Front, Back, Left Side, Right Side
  // Back and Right Side are mirrored
  const flip = label === 'Back' || label === 'Right Side'
  return (
    <svg
      width="60"
      height="38"
      viewBox="0 0 60 38"
      fill="none"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* Sole */}
      <path d="M4,30 Q6,18 20,16 L40,16 Q50,16 54,22 Q56,26 54,30 Z" stroke="#D4D4D0" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      {/* Upper / collar */}
      <path d="M20,16 Q18,7 24,6 L38,6 Q43,6 40,16" stroke="#D4D4D0" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      {/* Lace lines */}
      <line x1="24" y1="9" x2="37" y2="9" stroke="#D4D4D0" strokeWidth="1.2"/>
      <line x1="23" y1="12.5" x2="36" y2="12.5" stroke="#D4D4D0" strokeWidth="1.2"/>
    </svg>
  )
}

export default function PhotosPage() {
  const router = useRouter()
  const { productName, images: ctxImages, setImages, setValidationResults } = useAuth()

  const [slots, setSlots] = useState<(ImagePayload | null)[]>(() => {
    const s: (ImagePayload | null)[] = Array(6).fill(null)
    ctxImages.forEach((img, i) => { if (i < 6) s[i] = img })
    return s
  })
  const [slotNames, setSlotNames] = useState<(string | null)[]>(Array(6).fill(null))
  const [slotResults, setSlotResults] = useState<(ImageValidationResult | null)[]>(Array(6).fill(null))
  const [mismatch, setMismatch] = useState(false)
  const [mismatchReason, setMismatchReason] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  useEffect(() => {
    if (!productName) router.replace('/authenticate/product')
  }, [productName, router])

  const filledCount = slots.filter(Boolean).length
  const hasValidated = slotResults.some((r) => r !== null)
  const passCount = slotResults.filter((r) => r?.pass).length
  const canSubmit = filledCount >= 5 && !validating

  async function loadSlot(index: number, file: File) {
    if (!file.type.startsWith('image/')) return
    try {
      const payload = await readFileAsBase64(file)
      setSlots((prev) => { const n = [...prev]; n[index] = payload; return n })
      setSlotNames((prev) => { const n = [...prev]; n[index] = file.name; return n })
      setSlotResults((prev) => { const n = [...prev]; n[index] = null; return n })
    } catch { /* ignore per-slot read errors */ }
  }

  function handleFileInput(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) loadSlot(index, file)
    e.target.value = ''
  }

  function handleDrop(index: number, e: React.DragEvent) {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files?.[0]
    if (file) loadSlot(index, file)
  }

  async function handleAuthenticate() {
    const filledImages = slots.filter(Boolean) as ImagePayload[]
    if (filledImages.length < 5) return

    setValidating(true)
    setError(null)
    setMismatch(false)
    setMismatchReason(null)

    let validation: ValidationResponse
    try {
      const res = await fetch('/api/validate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, images: filledImages }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Photo validation failed')
        setValidating(false)
        return
      }
      validation = data as ValidationResponse
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo validation failed')
      setValidating(false)
      return
    }

    // Map flat validation results back to their original slot positions
    const newSlotResults: (ImageValidationResult | null)[] = Array(6).fill(null)
    let vi = 0
    for (let i = 0; i < slots.length; i++) {
      if (slots[i]) {
        const vr = validation.images[vi++]
        if (vr) newSlotResults[i] = { ...vr, index: i }
      }
    }
    setSlotResults(newSlotResults)
    setMismatch(validation.mismatch)
    setMismatchReason(validation.mismatch_reason)
    setValidating(false)

    const passing = validation.images.filter((r) => r.pass).length
    if (validation.mismatch || passing < 5) return

    setImages(filledImages)
    setValidationResults(validation.images)
    router.push('/authenticate/processing')
  }

  if (!productName) return null

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
        Upload your photos
      </h1>
      <p style={{ color: '#8A8A8A', margin: '0 0 32px', fontSize: '13px' }}>
        {filledCount}/6 slots filled — minimum 5 required
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {SLOT_LABELS.map((label, i) => {
          const hasPhoto = !!slots[i]
          const result = slotResults[i]
          const isDragTarget = dragOver === i

          let borderColor = '#E8E8E4'
          if (isDragTarget) borderColor = '#111111'
          else if (result?.pass) borderColor = '#1A7A4A'
          else if (result && !result.pass) borderColor = '#C0392B'

          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => fileInputRefs.current[i]?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(i) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(i, e)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  border: `2px dashed ${borderColor}`,
                  borderRadius: '8px',
                  background: hasPhoto ? '#FFFFFF' : isDragTarget ? '#F0F0EE' : '#FAFAF8',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                }}
              >
                {hasPhoto ? (
                  <div style={{ textAlign: 'center' }}>
                    {result?.pass && (
                      <div style={{ fontSize: '20px', marginBottom: '4px', transition: 'opacity 0.2s ease' }}>✓</div>
                    )}
                    {result && !result.pass && (
                      <div style={{ fontSize: '20px', color: '#C0392B', marginBottom: '4px' }}>✗</div>
                    )}
                    <div style={{ fontSize: '11px', color: '#555', wordBreak: 'break-all', lineHeight: 1.3 }}>
                      {slotNames[i] ?? 'Photo loaded'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8A8A8A', marginTop: '2px' }}>{label}</div>
                  </div>
                ) : (
                  <>
                    <SlotIcon label={label} />
                    <span style={{ fontSize: '12px', color: '#8A8A8A', fontWeight: 500 }}>{label}</span>
                  </>
                )}
              </button>

              {result && !result.pass && result.reason && (
                <p style={{
                  margin: '6px 0 0',
                  fontSize: '11px',
                  color: '#C0392B',
                  lineHeight: 1.3,
                }}>
                  {result.reason}
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                ref={(el) => { fileInputRefs.current[i] = el }}
                onChange={(e) => handleFileInput(i, e)}
                style={{ display: 'none' }}
              />
            </div>
          )
        })}
      </div>

      {mismatch && (
        <p style={{ color: '#C0392B', marginBottom: '16px', fontSize: '14px' }}>
          ❌ {mismatchReason ?? "Images don't match the named product. Fix the product name or upload correct photos."}
        </p>
      )}

      {hasValidated && !mismatch && passCount < 5 && (
        <p style={{ color: '#C0392B', marginBottom: '16px', fontSize: '14px' }}>
          Only {passCount}/5 required photos passed. Replace the failed photos and try again.
        </p>
      )}

      {error && (
        <p style={{ color: '#C0392B', marginBottom: '16px', fontSize: '14px' }}>Error: {error}</p>
      )}

      <button
        onClick={handleAuthenticate}
        disabled={!canSubmit}
        style={{
          background: canSubmit ? '#111111' : '#E8E8E4',
          color: canSubmit ? '#FFFFFF' : '#8A8A8A',
          padding: '13px 28px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: canSubmit ? 'pointer' : 'default',
          transition: 'background 0.15s ease, color 0.15s ease',
        }}
      >
        {validating ? 'Checking photos…' : 'Authenticate'}
      </button>
      <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#8A8A8A' }}>
        Analysis takes up to 30 seconds
      </p>
    </main>
  )
}
