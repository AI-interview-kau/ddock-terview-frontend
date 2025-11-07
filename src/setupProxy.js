const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 환경변수에서 API URL 가져오기
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const AI_SERVER_URL = process.env.REACT_APP_AI_SERVER_URL;

  // 기존 백엔드 API 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
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
      target: AI_SERVER_URL,
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
