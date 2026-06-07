/**
 * Extracts the first complete JSON object from a string.
 * Strips markdown code fences, then uses a depth counter that skips
 * characters inside string literals. Also sanitizes literal control
 * characters inside strings (unescaped newlines from model output)
 * that would fail JSON.parse.
 */
export function extractFirstJson(text: string): string | null {
  const cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim()

  const start = cleaned.indexOf('{')
  if (start === -1) return null

  let depth = 0
  let inString = false
  let escape = false
  const out: string[] = []

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i]

    if (escape) { escape = false; out.push(ch); continue }
    if (ch === '\\' && inString) { escape = true; out.push(ch); continue }
    if (ch === '"') { inString = !inString; out.push(ch); continue }

    if (inString) {
      // Escape bare control characters that make JSON.parse fail
      if (ch === '\n') { out.push('\\n'); continue }
      if (ch === '\r') { out.push('\\r'); continue }
      if (ch === '\t') { out.push('\\t'); continue }
      out.push(ch)
      continue
    }

    if (ch === '{') { depth++; out.push(ch) }
    else if (ch === '}') {
      depth--
      out.push(ch)
      if (depth === 0) return out.join('')
    } else {
      out.push(ch)
    }
  }
  return null
}
