import fs from 'node:fs'
import path from 'node:path'

const VIRTUAL_ID = 'virtual:quasar-langs-required'
const RESOLVED_ID = '\0' + VIRTUAL_ID

export default function quasarLangsRequiredPlugin() {
  let localesDir = ''

  return {
    name: 'vite-plugin-quasar-langs-required',
    configResolved(config) {
      localesDir = path.resolve(config.root, 'src/locales')
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return

      const langs = new Set()

      try {
        const files = fs.readdirSync(localesDir).filter((file) => file.endsWith('.json'))
        for (const file of files) {
          try {
            const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'))
            const lang = content['#quasar.lang']
            if (lang) langs.add(lang)
          } catch (err) {
            console.error('Unable to parse locale file:', err.message)
          }
        }
      } catch (err) {
        console.error('Unable to load locale files:', err.message)
      }

      const imports = [...langs]
        .map(
          (lang) =>
            `import lang_${lang.replace('-', '_')} from '/node_modules/quasar/lang/${lang}.js'`
        )
        .join('\n')

      const exports = [...langs]
        .map((lang) => `'${lang}': lang_${lang.replace('-', '_')}`)
        .join(',\n')

      return `
        ${imports}
        export default {
          ${exports}
        }
      `
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(localesDir) && file.endsWith('.json')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
        return []
      }
    }
  }
}
