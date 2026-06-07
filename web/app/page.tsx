
const CHECK_ROWS = [
  { name: 'Heel tab font & sizing', result: 'Fail', detail: 'Font 15% thicker than Jordan Brand spec — common on Chicago replicas from 2022 batch.' },
  { name: 'Red panel leather grain', result: 'Fail', detail: 'Smooth grain inconsistent with authentic Nike full-grain leather used on OG Chicago run.' },
  { name: 'SKU barcode (555088-101)', result: 'Fail', detail: 'Barcode does not return correct SKU for Chicago colorway.' },
  { name: 'Outsole stamp placement', result: 'Pass', detail: 'Air unit stamp positioned correctly at heel.' },
  { name: 'Toe box shape', result: 'Pass', detail: 'Curvature within tolerance for Jordan 1 High last.' },
]

const STEPS = [
  { n: '1', heading: 'Name your shoe', body: 'Tell us what you bought — Jordan 1 Chicago, Dunk Low Panda, Yeezy 350 V2. Be specific. We know the tells for each one.' },
  { n: '2', heading: 'Upload your photos', body: 'Six angles: front, back, sides, sole, and tag. Drag and drop. We flag any photo that\'s too blurry to use before you submit.' },
  { n: '3', heading: 'Get your verdict', body: 'Authentic. Likely Fake. Or Inconclusive — with a specific reason and exactly what to do next.' },
]

function ResultIcon({ result }: { result: string }) {
  if (result === 'Pass') return <span style={{ color: '#1A7A4A', fontWeight: 600, fontSize: '13px' }}>✓ Pass</span>
  if (result === 'Fail') return <span style={{ color: '#C0392B', fontWeight: 600, fontSize: '13px' }}>✗ Fail</span>
  return <span style={{ color: '#D4820A', fontWeight: 600, fontSize: '13px' }}>⚠ Inconclusive</span>
}

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '80px 20px 72px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '40px',
          fontWeight: 700,
          color: '#111111',
          margin: '0 0 16px',
          letterSpacing: '-0.8px',
          lineHeight: 1.15,
        }}>
          You don't need Reddit to tell you<br />if your $280 shoes are fake.
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#8A8A8A',
          margin: '0 0 40px',
          lineHeight: 1.6,
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Upload six photos. Get a verdict in 30 seconds — with the exact evidence you need to keep it or return it.
        </p>
        <a href="https://buy.stripe.com/test_dRm5kF8nlgCr8Uu4aRenS00" target="_blank" rel="noopener noreferrer" style={
          display: 'inline-block',
          background: '#111111',
          color: '#FFFFFF',
          padding: '14px 36px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '16px',
          letterSpacing: '-0.2px',
        }>
          Authenticate an Item
        </a>
        <p style={{ fontSize: '13px', color: '#BBBBBB', marginTop: '16px' }}>
          No account. No install. Free.
        </p>
      </section>

      {/* ── The Moment ── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E8E8E4', borderBottom: '1px solid #E8E8E4' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 20px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111111', margin: '0 0 24px', letterSpacing: '-0.5px' }}>
            The box arrived. Something's off.
          </h2>
          <p style={{ fontSize: '16px', color: '#444444', lineHeight: 1.7, margin: '0 0 16px' }}>
            Maybe it's the toe box. Maybe the leather looks wrong. Maybe you can't name it — you just know.
          </p>
          <p style={{ fontSize: '16px', color: '#444444', lineHeight: 1.7, margin: '0 0 16px' }}>
            You paid $280. The return window is closing. Your options: post on Reddit and wait three hours for someone to say "looks legit to me" — with no explanation. Text a friend who might reply tomorrow. Or accept them and spend the next six months wondering.
          </p>
          <p style={{ fontSize: '16px', color: '#111111', fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
            None of that is good enough. AuthCheck is built for this moment.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 20px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111111', margin: '0 0 36px', letterSpacing: '-0.5px' }}>
          Three steps. Thirty seconds.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {STEPS.map((step) => (
            <div key={step.n} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#111111',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {step.n}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px', color: '#111111', marginBottom: '4px' }}>{step.heading}</div>
                <div style={{ fontSize: '15px', color: '#666666', lineHeight: 1.6 }}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample Verdict ── */}
      <section style={{ background: '#F8F8F6', borderTop: '1px solid #E8E8E4', borderBottom: '1px solid #E8E8E4' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 20px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Not "looks real." Actual evidence.
          </h2>
          <p style={{ fontSize: '16px', color: '#8A8A8A', margin: '0 0 32px', lineHeight: 1.6 }}>
            Every result names the specific checks we ran — not generic observations.
          </p>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E8E4',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            {/* Verdict header */}
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #E8E8E4' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FDF1F0',
                border: '1px solid #C0392B',
                borderRadius: '6px',
                padding: '6px 14px',
                marginBottom: '16px',
              }}>
                <span style={{ color: '#C0392B', fontSize: '15px' }}>✗</span>
                <span style={{ color: '#C0392B', fontWeight: 700, fontSize: '15px' }}>Likely Fake</span>
              </div>
              <div style={{ fontSize: '42px', fontWeight: 700, color: '#111111', lineHeight: 1, marginBottom: '6px' }}>91% Confident</div>
              <div style={{ fontSize: '13px', color: '#8A8A8A' }}>3 of 5 checks failed. One check inconclusive due to photo angle.</div>
            </div>

            {/* Check table */}
            <div>
              {CHECK_ROWS.map((row, i) => (
                <div key={row.name} style={{
                  padding: '14px 24px',
                  borderBottom: i < CHECK_ROWS.length - 1 ? '1px solid #F0F0EE' : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#111111', marginBottom: row.result !== 'Pass' ? '4px' : 0 }}>{row.name}</div>
                    {row.result !== 'Pass' && (
                      <div style={{ fontSize: '13px', color: '#8A8A8A', lineHeight: 1.5 }}>{row.detail}</div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <ResultIcon result={row.result} />
                  </div>
                </div>
              ))}
            </div>

            {/* Next step */}
            <div style={{
              padding: '16px 24px',
              background: '#FDF1F0',
              borderTop: '1px solid #E8E8E4',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Next Step</div>
              <div style={{ fontSize: '14px', color: '#333333', lineHeight: 1.6 }}>
                Do not accept this item. Document the heel tab and barcode failures — use these specifics when requesting a refund.
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#AAAAAA', marginTop: '16px', textAlign: 'center' }}>
            Sample output — Jordan 1 Retro High OG Chicago
          </p>
        </div>
      </section>

      {/* ── Why It Works + Honesty ── */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E8E4',
            borderRadius: '10px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#111111', marginBottom: '12px', letterSpacing: '-0.3px' }}>
              Model-specific. Not generic.
            </div>
            <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.65, margin: 0 }}>
              Authenticating a Jordan 1 Chicago is not the same as authenticating a Dunk Low Panda. The tells are different. The fakes are different. The SKUs are different. AuthCheck knows the difference.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E8E4',
            borderRadius: '10px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#111111', marginBottom: '12px', letterSpacing: '-0.3px' }}>
              We'll never say 100%.
            </div>
            <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.65, margin: 0 }}>
              Photo authentication can't verify internal materials, weight, or smell. So we cap confidence at 95% — always — and tell you exactly why. Honesty about limits is more useful than false certainty.
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        background: '#111111',
        textAlign: 'center',
        padding: '72px 20px',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#FFFFFF',
          margin: '0 0 12px',
          letterSpacing: '-0.5px',
        }}>
          Something feels off. Find out in 30 seconds.
        </h2>
        <p style={{ fontSize: '16px', color: '#888888', margin: '0 0 36px' }}>
          Your photos are never stored. No account required.
        </p>
        <a href="https://buy.stripe.com/test_dRm5kF8nlgCr8Uu4aRenS00" target="_blank" rel="noopener noreferrer" style={
          display: 'inline-block',
          background: '#FFFFFF',
          color: '#111111',
          padding: '14px 36px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '16px',
          letterSpacing: '-0.2px',
        }>
          Authenticate an Item
        </a>
      </section>

    </main>
  )
}
