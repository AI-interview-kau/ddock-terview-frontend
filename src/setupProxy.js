const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 기존 백엔드 API 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ddock-terview.ap-northeast-2.elasticbeanstalk.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // /api 제거
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy - Backend]:', req.method, req.url, '→', proxyReq.path);
      },
    })
  );

  // AI 서버 API 프록시 (질문 생성 & 면접 진행)
  app.use(
    '/ai-api',
    createProxyMiddleware({
      target: 'https://ddockterview-api-299282571203.us-central1.run.app',
      changeOrigin: true,
      secure: true, // HTTPS 인증서 검증
      pathRewrite: {
        '^/ai-api': '', // /ai-api 제거
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy - AI Server]:', req.method, req.url, '→', proxyReq.path);
        console.log('[Proxy - AI Server] Headers:', proxyReq.getHeaders());
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('[Proxy - AI Server Response]:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('[Proxy - AI Server Error]:', err.message);
      },
    })
  );
};
