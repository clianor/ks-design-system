const path = require('path');

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)?$/,
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx',
        target: 'es2015',
        tsconfigRaw: require('../tsconfig.json'),
      },
    });

    config.resolve.extensions.push('.ts', '.tsx');

    Object.assign(config.resolve.alias, {
      '@ks-design-system/ui': path.resolve(__dirname, '../packages/ui/src'),
      '@ks-design-system/utils': path.resolve(
        __dirname,
        '../packages/utils/src',
      ),
    });

    return config;
  },
  framework: '@storybook/react',
};
