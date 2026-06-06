'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import type { AuthCheck } from '@/types/auth'

const VERDICT_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  'Authentic':    { color: '#1A7A4A', bg: '#E8F5ED', label: '✅ Authentic' },
  'Likely Fake':  { color: '#C0392B', bg: '#FBE9E7', label: '❌ Likely Fake' },
  'Inconclusive': { color: '#D4820A', bg: '#FEF3E2', label: '⚠️ Inconclusive' },
}

const CHECK_ICONS: Record<string, string> = {
  Pass: '✅', Fail: '❌', Inconclusive: '⚠️',
}

export default function ResultPage() {
  const router = useRouter()
  const { result, productName, reset } = useAuth()
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [shareLabel, setShareLabel] = useState('Share Result')

  useEffect(() => {
    if (!result) router.replace('/')
  }, [result, router])

  if (!result) return null

  const style = VERDICT_STYLES[result.verdict] ?? VERDICT_STYLES['Inconclusive']

  function toggleRow(i: number) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  async function handleShare() {
    const text = [
      `AuthCheck Result — ${productName}`,
      `Verdict: ${result!.verdict} (${result!.confidence}% confidence)`,
      result!.confidence_note,
      '',
      ...result!.checks.map((c) =>
        `${c.result === 'Pass' ? '✓' : c.result === 'Fail' ? '✗' : '?'} ${c.name}: ${c.detail}`
      ),
      '',
      `Next step: ${result!.next_step}`,
    ].join('\n')

    if (navigator.share) {
      try { await navigator.share({ title: 'AuthCheck Result', text }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text)
      setShareLabel('Copied!')
      setTimeout(() => setShareLabel('Share Result'), 2000)
    }
  }

  function handleStartNew() {
    reset()
    router.push('/')
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>

      {/* Verdict badge */}
      <div style={{
        background: style.bg,
        border: `2px solid ${style.color}`,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: style.color }}>
          {style.label}
        </div>
        <div style={{ fontSize: '48px', fontWeight: 700, color: '#111111', lineHeight: 1.1, margin: '8px 0 4px' }}>
          {result.confidence}%
        </div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#111111' }}>Confident</div>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#8A8A8A', lineHeight: 1.5 }}>
          {result.confidence_note}
        </p>
      </div>

      {/* Check table */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E8E8E4',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E8E4', background: '#FAFAF8' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#111111' }}>Check</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#111111', width: '140px' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {result.checks.map((check: AuthCheck, i: number) => {
              const isExpandable = check.result !== 'Pass'
              const isExpanded = expandedRows.has(i)
              const isLast = i === result.checks.length - 1

              return (
                <tr
                  key={i}
                  onClick={() => isExpandable && toggleRow(i)}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #E8E8E4',
                    cursor: isExpandable ? 'pointer' : 'default',
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#111111', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{check.name}</span>
                      {isExpandable && (
                        <span style={{
                          fontSize: '10px',
                          color: '#8A8A8A',
                          transition: 'transform 0.2s ease',
                          display: 'inline-block',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}>
                          ▼
                        </span>
                      )}
                    </div>
                    {/* Smooth expand — always rendered, height controlled by max-height */}
                    <div style={{
                      maxHeight: isExpanded ? '200px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.25s ease',
                    }}>
                      <div style={{ fontSize: '13px', color: '#555', paddingTop: '6px', paddingBottom: '2px', lineHeight: 1.4 }}>
                        {check.detail}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {CHECK_ICONS[check.result]} {check.result}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Next step */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E8E8E4',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#8A8A8A', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Next Step
        </div>
        <p style={{ margin: 0, fontSize: '16px', color: '#111111', lineHeight: 1.5 }}>
          {result.next_step}
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleStartNew}
          style={{
            flex: 1,
            background: '#111111',
            color: '#FFFFFF',
            padding: '13px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Start New Authentication
        </button>
        <button
          onClick={handleShare}
          style={{
            flex: 1,
            background: '#FFFFFF',
            color: '#111111',
            padding: '13px 24px',
            border: '1px solid #E8E8E4',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {shareLabel}
        </button>
      </div>
    </main>
  )
}
