import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 56px)',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111111', margin: 0, letterSpacing: '-0.5px' }}>
        AuthCheck
      </h1>
      <p style={{ color: '#8A8A8A', margin: '8px 0 48px', fontSize: '16px' }}>
        Know before you keep it.
      </p>
      <Link href="/category" style={{
        background: '#111111',
        color: '#FFFFFF',
        padding: '14px 32px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '16px',
      }}>
        Authenticate an Item
      </Link>
    </main>
  )
}
