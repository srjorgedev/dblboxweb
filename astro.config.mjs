// @ts-check
import { defineConfig, envField } from 'astro/config';

import vercel from '@astrojs/vercel';

import db from '@astrojs/db';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [db(), react()],
  env: {
    schema: {
      API_URL: envField.string({ access: 'public', context: 'client' }),
      API_CURR_VERSION: envField.string({ access: 'public', context: 'client' })
    }
  }
});