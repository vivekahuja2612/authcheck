'use client'

import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { id: 'sneakers', label: 'Sneakers', active: true },
  { id: 'handbags', label: 'Handbags', active: false },
  { id: 'watches', label: 'Watches', active: false },
  { id: 'luxury', label: 'Luxury Accessories', active: false },
]

export default function CategoryPage() {
  const router = useRouter()

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', margin: '0 0 32px', letterSpacing: '-0.5px' }}>
        What are you authenticating?
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => cat.active && router.push('/authenticate/product')}
            disabled={!cat.active}
            style={{
              padding: '20px',
              border: `1px solid ${cat.active ? '#E8E8E4' : '#EFEFED'}`,
              borderRadius: '8px',
              background: cat.active ? '#FFFFFF' : '#F4F4F2',
              cursor: cat.active ? 'pointer' : 'default',
              textAlign: 'left',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
          >
            <div style={{
              fontWeight: 600,
              fontSize: '16px',
              color: cat.active ? '#111111' : '#AAAAAA',
            }}>
              {cat.label}
            </div>
            {!cat.active && (
              <div style={{ fontSize: '12px', color: '#BBBBBB', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                  <rect x="1" y="5" width="8" height="6" rx="1.5" stroke="#BBBBBB" strokeWidth="1.2"/>
                  <path d="M3 5V3.5a2 2 0 1 1 4 0V5" stroke="#BBBBBB" strokeWidth="1.2"/>
                </svg>
                Coming Soon
              </div>
            )}
          </button>
        ))}
      </div>
    </main>
  )
}
