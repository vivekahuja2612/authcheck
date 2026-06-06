import Link from 'next/link'

export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid #E8E8E4',
      background: '#FFFFFF',
      height: '56px',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '0 20px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
      <Link href="/" style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 700,
        fontSize: '18px',
        color: '#111111',
        textDecoration: 'none',
        letterSpacing: '-0.5px',
      }}>
        AuthCheck
      </Link>
      </div>
    </header>
  )
}
