// vite.config.js
export default {
    // ... другие настройки Vite ...
    server: {
      proxy: {
        '/api': {
          target: 'http://10.10.31.31:8083',
          changeOrigin: true, // необходимо для включения CORS
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      host: '0.0.0.0',
    },
  };
  