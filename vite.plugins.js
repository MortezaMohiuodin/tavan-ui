import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Components from 'unplugin-vue-components/vite' // This imports the plugin
import AutoImport from 'unplugin-auto-import/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'

import {
  VueUseComponentsResolver,
  VueUseDirectiveResolver,
} from 'unplugin-vue-components/resolvers'

const plugins = [
  vue({
    template: { transformAssetUrls },
    script: {
      defineModel: true,
    },
  }),
  Pages({ exclude: ['**/components/*.vue','**/forms/*.vue'] }),

  Layouts({}),
  // VueRouter({
  
  // }),
  // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
  vuetify({
    autoImport: true,
    styles: { configFile: 'src/assets/customVuetify.scss' },
  }),
  AutoImport({
    // targets to transform
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],

    // global imports to register
    imports: [
      // presets
      'vue',
      'vue-router',
      '@vueuse/core',
      'vue-i18n',
      {
        // '@vueuse/core': [
        //   // named imports
        //   'useMouse', // import { useMouse } from '@vueuse/core',
        //   // alias
        //   ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
        // ],
        '@/plugins/enums': [
          '$enums',
          '$getEnum',
        ],
        '@/plugins/moment': [
          '$moment',
        ],
        'vue-prism-component': [
          'Prism',
        ],
        '@/store/app': [
          'useAppStore',
        ],

        // '[package-name]': [
        //   '[import-names]',
        //
        //   // alias
        //   ['[from]', '[alias]'],
        // ],
      },

      // example type import
      {
        from: 'vue-router',
        imports: ['RouteLocationRaw'],
        type: true,
      },
      {
        from: 'vue-prism-component',
        imports: ['Prism'],
        type: true,
      },
    ],

    // Enable auto import by filename for default module exports under directories
    defaultExportByFilename: false,

    // Auto import for module exports under directories
    // by default it only scan one level of modules under the directory
    dirs: [
      './src/composables/**', // all nested modules
      './src/helper',
      './src/assets/images',
    ],

    // Filepath to generate corresponding .d.ts file.
    // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
    // Set `false` to disable.
    dts: './auto-imports.d.ts',

    // Cache the result of resolving, across multiple vite builds.
    // A custom path is supported.
    // When set to `true`, the cache will be stored in `node_modules/.cache/unplugin-auto-import.json`.
    cache: false,

    // Auto import inside Vue template
    // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
    vueTemplate: false,

    // Custom resolvers, compatible with `unplugin-vue-components`
    // see https://github.com/antfu/unplugin-auto-import/pull/23/
    resolvers: [
      /* ... */
    ],

    // Inject the imports at the end of other imports
    injectAtEnd: true,

    // Generate corresponding .eslintrc-auto-import.json file.
    // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
    eslintrc: {
      enabled: true, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
  }),
  Components({
    resolvers: [
      VueUseComponentsResolver(),
      VueUseDirectiveResolver(),
    ],
  }),
]

export default plugins