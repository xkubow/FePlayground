import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { defineConfig, loadEnv, ProxyOptions } from 'vite';

const kestrelProxy = {
  target: 'http://localhost:5000/',
  changeOrigin: true,
  // secure: false,
  logLevel: 'debug',
};
const mockServer = {
  target: 'http://localhost:9001/',
  changeOrigin: true,
  // secure: false,
  logLevel: 'debug',
  // rewrite: (path: any) => path.replace(/^\/api/, ''),
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useMocks = env.VITE_MOCK === 'true';

  const proxy: Record<string, string | ProxyOptions> = useMocks
    ? {}
    : {
        // '^/api/auth': mockServer,
        '^/api': kestrelProxy,
      };

  return {
    plugins: [vue(), vueJsx()],
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // additionalData: `
          // 	@import "src/styles/mixins.scss";
          // `,
        },
      },
    },
    server: {
      proxy,
    },
    resolve: {
      alias: {
        //'@': fileURLToPath(new URL('./src', import.meta.url)),
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});
