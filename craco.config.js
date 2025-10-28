module.exports = {
  babel: {
    plugins: [
      [
        'babel-plugin-styled-components',
        {
          displayName: true,
          fileName: true,
          ssr: false,
          minify: true,
          transpileTemplateLiterals: true,
          pure: true,
        },
      ],
    ],
  },
};
