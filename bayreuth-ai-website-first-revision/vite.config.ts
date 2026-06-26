import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lingui } from '@lingui/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
  ],
  resolve: {
    // Prevents duplicate React instances when bun/pnpm resolves multiple versions.
    // Without this, hooks throw "Invalid hook call" because two Reacts are loaded.
    dedupe: ['react', 'react-dom', 'react-dom/client'],
  },
})
