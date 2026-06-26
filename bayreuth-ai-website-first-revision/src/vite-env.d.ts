/// <reference types="vite/client" />

declare module '*.po' {
  import type { Messages } from '@lingui/core'
  export const messages: Messages
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
