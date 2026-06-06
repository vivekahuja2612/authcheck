export type CheckResult = 'Pass' | 'Fail' | 'Inconclusive'
export type Verdict = 'Authentic' | 'Likely Fake' | 'Inconclusive'

export interface AuthCheck {
  name: string
  result: CheckResult
  detail: string
}

export interface AuthResult {
  verdict: Verdict
  confidence: number
  confidence_note: string
  checks: AuthCheck[]
  next_step: string
}

export interface ImagePayload {
  data: string
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
}

export interface ImageValidationResult {
  index: number
  pass: boolean
  reason: string | null
}

export interface ValidationResponse {
  images: ImageValidationResult[]
  mismatch: boolean
  mismatch_reason: string | null
}
