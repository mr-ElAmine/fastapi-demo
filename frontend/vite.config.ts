import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'run-command-on-change',
      handleHotUpdate(context) {
        console.log(`File changed: ${context.file}`);

        exec('pnpm fix', (err, stdout, stderr) => {
          if (err) {
            console.error(`Error running command: ${err.message}`);
            return;
          }
          if (stdout) {
            console.log(`Command output: ${stdout}`);
          }
          if (stderr) {
            console.error(`Command error: ${stderr}`);
          }
        });

        return context.modules;
      },
    },
  ],
  resolve: {
    alias: {
      '@': `${__dirname}/src`,
    },
  },
});
