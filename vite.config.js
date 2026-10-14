import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Лендинг + три демо-меню отдельными страницами: /kofe/, /pub/, /tatar/
// base './' — сборка работает из любой папки хостинга.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        kofe: resolve(import.meta.dirname, 'kofe/index.html'),
        pub: resolve(import.meta.dirname, 'pub/index.html'),
        tatar: resolve(import.meta.dirname, 'tatar/index.html'),
      },
    },
  },
})
