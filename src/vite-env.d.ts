/// <reference types="vite/client" />

declare module '*.po' {
  import type { Messages } from '@lingui/core'
  export const messages: Messages
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** Where membership applications are posted; unset means online applications are closed. */
  readonly VITE_MEMBERSHIP_FORM_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
