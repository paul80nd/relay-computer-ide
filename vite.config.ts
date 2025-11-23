import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
		fs: {
			allow: ['../../', '../../../vscode']
		}
	},
  resolve: {
		alias: [{
			find: 'monaco-editor-core/esm/vs',
			replacement: join(__dirname, '../../../vscode/src/vs')
		}, {
			find: 'monaco-editor-core',
			replacement: join(__dirname, '../../../vscode/src/vs/editor/editor.main.ts')
		}],
	},
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          monaco: ['monaco-editor'],
          fluent: ['@fluentui/react-components'],
        },
      },
    },
  },
})
