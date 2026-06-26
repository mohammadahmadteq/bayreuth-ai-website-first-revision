import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lingui } from '@lingui/vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project page under /<repo>/.
  // Keep dev at root; only prefix the path for production builds.
  base: command === 'build' ? '/bayreuth-ai-website-first-revision/' : '/',
  plugins: [
    // `babel` is accepted at runtime by plugin-react but dropped from its v6
    // `Options` type; cast keeps the Lingui macro transform without changing behavior.
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    } as Parameters<typeof react>[0]),
    lingui(),
  ],
  resolve: {
    // Prevents duplicate React instances when bun/pnpm resolves multiple versions.
    // Without this, hooks throw "Invalid hook call" because two Reacts are loaded.
    dedupe: ['react', 'react-dom', 'react-dom/client'],
  },
}))
