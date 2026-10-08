import { fileURLToPath, URL } from 'node:url'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'

import quasarLangsRequiredPlugin from './plugins/quasar-langs-required.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8085,
    strictPort: true
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: fileURLToPath(new URL('./src/styles/quasar.sass', import.meta.url))
    }),
    VueI18nPlugin({
      include: resolve(__dirname, './src/locales/**'),
      runtimeOnly: false
    }),
    quasarLangsRequiredPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
