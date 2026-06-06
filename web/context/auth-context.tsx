'use client'

import { createContext, useContext, useState } from 'react'
import type { AuthResult, ImagePayload, ImageValidationResult } from '@/types/auth'

interface AuthState {
  productName: string
  images: ImagePayload[]
  validationResults: ImageValidationResult[]
  result: AuthResult | null
  error: string | null
}

interface AuthContextValue extends AuthState {
  setProductName: (name: string) => void
  setImages: (images: ImagePayload[]) => void
  setValidationResults: (results: ImageValidationResult[]) => void
  setResult: (result: AuthResult | null) => void
  setError: (error: string | null) => void
  reset: () => void
}

const defaultState: AuthState = {
  productName: '',
  images: [],
  validationResults: [],
  result: null,
  error: null,
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState)

  const ctx: AuthContextValue = {
    ...state,
    setProductName: (productName) => setState((s) => ({ ...s, productName })),
    setImages: (images) => setState((s) => ({ ...s, images })),
    setValidationResults: (validationResults) => setState((s) => ({ ...s, validationResults })),
    setResult: (result) => setState((s) => ({ ...s, result })),
    setError: (error) => setState((s) => ({ ...s, error })),
    reset: () => setState(defaultState),
  }

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
