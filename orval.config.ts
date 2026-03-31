import { defineConfig } from 'orval';

export default defineConfig({
  configurationApi: {
    input: {
      target: './swagger.json',
    },
        output: {
          target: 'src/api/generated/index.ts',
          schemas: 'src/api/generated/model',
          client: 'axios-functions',
          mode: 'tags-split',
          override: {
            mutator: {
              path: './src/api/mutator/custom-instance.ts',
              name: 'customInstance',
            },
          },
        },
      },
    });