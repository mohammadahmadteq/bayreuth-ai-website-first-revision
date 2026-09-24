import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ command }) => ({
  root,
  envDir: fileURLToPath(new URL('..', import.meta.url)),
  base: command === 'build' ? '/bayreuth-ai-website-first-revision/admin/' : '/',
  plugins: [react()],
  server: { port: 5174 },
  build: { outDir: fileURLToPath(new URL('../dist/admin', import.meta.url)), emptyOutDir: false },
}))
