const { createProxyMiddleware } = require('http-proxy-middleware');

const RENDER  = 'https://niti-ayog-website-gu.onrender.com';
const LOCAL   = 'http://localhost:5000';

module.exports = function (app) {
  // New routes only on local backend
  const localRoutes = [
    '/api/upload',
    '/api/export',
    '/api/admission-records',
  ];

  localRoutes.forEach((route) => {
    app.use(
      route,
      createProxyMiddleware({
        target: LOCAL,
        changeOrigin: true,
        secure: false,
      })
    );
  });

  // Everything else → Render (students, alumni, admin login, etc.)
  app.use(
    '/api',
    createProxyMiddleware({
      target: RENDER,
      changeOrigin: true,
      secure: true,
    })
  );
};
