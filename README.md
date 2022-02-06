# ks-design-system

## 프로젝트 셋팅

### Lerna 환경 구성
```shell
// independent 옵션 사용시 각 패키지별 버전 지정 가능 관리 가능
$ npx lerna init --independent // or npx lerna init
```

### Yarn Workspace 설정
```json
// lerna.json
{
  "packages": [
    "packages/*"
  ],
  "version": "independent",
  "useWorkspaces": true,
  "npmClient": "yarn"
}
```

```json
// package.json
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^4.0.0"
  },
  "workspaces": [
    "packages/*"
  ]
}
```

### typescript 추가
```json
// package.json
...
  "scripts": {
    "ci": "yarn install --frozen-lockfile",
    "lerna": "lerna"
  },
...
```

```shell
$ yarn ci
$ yarn add -DW typescript
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react",
    "esModuleInterop": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "es2015",
    "composite": true
  }
}
```

### utils 패키지 추가
```json
// packages/utils/package.json
{
  "name": "@ks-design-system/utils",
  "version": "0.0.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "private": true,
  "scripts": {
    "build": "tsc -b"
  }
}
```

```json
// packages/utils/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

```ts
// packages/utils/src/index.ts
export function roll(roll: string): string {
  return `I rolled a dice: ${roll}. Outcome grim`;
}
```

### utils 패키지 추가
```json
// packages/ui/package.json
{
  "name": "@ks-design-system/ui",
  "version": "0.0.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "private": true,
  "scripts": {
    "build": "tsc -b"
  }
}
```

```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "target": "ES2019",
    "lib": [ "dom", "ES2019"]
  },
  "references": [
    { "path":  "../utils" }
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

```tsx
// packages/ui/src/index.ts
import { roll } from "@ks-design-system/utils";

console.log(roll("1d20"));
```

### ui, utils 패키지 기본 설정
```shell
// 의존성 설치하기
$ yarn lerna bootstrap
// 모든 패키지에서 빌드를 실행함 ( --stream 옵션은 prefix를 붙인 결과를 보여줌 )
$ yarn lerna run build --stream
$ yarn add -DW rimraf
```

```json
// packages/utils/package.json
// packages/ui/package.json
{
  ...,
  "scripts": {
    "build": "tsc -b",
    "clean": "rimraf ./dist && rimraf tsconfig.tsbuildinfo",
    "watch": "tsc -b -w --preserveWatchOutput"
  },
  ...
}
```

```json
// package.json
{
  ...,
  "scripts": {
    "ci": "yarn install --frozen-lockfile",
    "lerna": "lerna",
    "build": "lerna run build --stream",
    "clean": "lerna run clean --parallel"
  },
  ...
}
```

### 웹팩 설정
```shell
$ yarn add -DW webpack webpack-cli ts-loader
```

```js
// packages/ui/webpack.config.js
// packages/utils/webpack.config.js
module.exports = function (env, argv) {
  return {
    mode: env.production ? "production" : "development",
    devtool: env.production ? "source-map" : "eval",
    entry: {
      index: "./src/index.ts", // utils는 ./src/index.ts
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  };
};
```

```json
// packages/ui/package.json
// packages/utils/package.json
{
  ...,
  "scripts": {
    "build": "webpack --env production",
    "clean": "rimraf ./dist && rimraf tsconfig.tsbuildinfo",
    "watch": "tsc -b -w --preserveWatchOutput"
  },
  ...,
}
```

### ESLint 설정
```shell
$ yarn add -DW eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier prettier
```

```js
// .eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
};
```

```js
// .prettierrc.js
module.exports = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true, // JSX에서 singleQuote or doubleQuote
  endOfLine: 'lf',
  trailingComma: 'all', // comma 항상 붙이기
  bracketSpacing: true, // 객체리터럴에서 { } 사이에 공백을 넣을 것인지
  jsxBracketSameLine: false, // 여러줄의 JSX 요소가 있을때, > 를 마지막 줄의 끝부분에서 닫을 것인지
  arrowParens: 'always', // (x) => x : always | x => x : avoid
};
```

```json
// package.json
{
  "scripts": {
    ...,
    "lint": "eslint ./packages --ext .ts,.tsx",
    "lint:fix": "eslint ./packages --ext .ts,.tsx --fix"
  }
}
```

### React & ESBuild  셋팅
```shell
$ yarn add -W react react-dom
$ yarn add -DW @types/react eslint-plugin-react esbuild-loader
```

```js
// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
};
```

```js
// packages/utils/webpack.config.js
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = function (env, argv) {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval',
    entry: {
      index: './src/index.ts',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015',
            tsconfigRaw: require('./tsconfig.json'),
          },
        },
      ],
    },
    optimization: {
      minimize: !!env.production,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
        }),
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    stats: {
      assetsSort: 'size',
      children: false,
      chunksSort: 'size',
      excludeAssets: /.js.map/,
      modules: false,
    },
  };
};
```

```js
// packages/ui/webpack.config.js
const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = function (env, argv) {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval',
    entry: {
      index: './src/index.ts',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015',
            tsconfigRaw: require('./tsconfig.json'),
          },
        },
      ],
    },
    optimization: {
      minimize: !!env.production,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
        }),
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@ks-design-system/utils': path.resolve(__dirname, '../utils/src'),
      },
    },
    stats: {
      assetsSort: 'size',
      children: false,
      chunksSort: 'size',
      excludeAssets: /.js.map/,
      modules: false,
    },
  };
};
```

```tsx
// packages/ui/src/index.ts
import React from 'react';
import { roll } from '@ks-design-system/utils';

export interface ButtonProps {
  label: string;
  roll?: true;
}

export const Button = (props: ButtonProps): JSX.Element => {
  return (
    <button>
      {props.label} {props.roll ? roll('1d20') : ''}
    </button>
  );
};
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["es5", "es2015", "es2016", "es2017", "DOM"],
    "jsx": "react",
    "baseUrl": "./",
    "paths": {
      "@ks-design-system/ui": ["./packages/ui/src"],
      "@ks-design-system/ui/*": ["./packages/ui/src/*"],
      "@ks-design-system/utils": ["./packages/utils/src"],
      "@ks-design-system/utils/*": ["./packages/utils/src/*"]
    },
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "composite": true
  },
  "exclude": ["**/node_modules", "**/.*/", "**/build"]
}
```

```json
// packages/utils/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*"]
}
```

```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*"],
  "references": [
    { "path":  "../utils" }
  ]
}
```

### Storybook 셋팅
```shell
$ npx sb init
```

생성된 stories 내부 파일 및 폴더 전부 제거
```js
// .storybook/main.js
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
      '@ks-design-system/utils': path.resolve(__dirname, '../packages/utils/src'),
    });

    return config;
  },
  framework: '@storybook/react',
};
```

```tsx
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button, ButtonProps } from '@ks-design-system/ui';

export default {
  title: 'Example/MonorepoButton',
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'label ->',
  roll: true,
};
```

```shell
$ yarn run storybook # 기존에 작성한 코드들을 이용한 결과물을 확인 가능
```

### 패키지 의존성 설치 및 삭제 방법
```shell
$ yarn lerna add {package_name} --scope={workspace_name}
$ yarn workspace {workspace_name} remove {package_name}
```

### emotion 및 framer-motion 설치
```shell
# https://stackoverflow.com/questions/62980752/lerna-add-no-packages-found-where-package-can-be-added
# lerna는 하나의 스코프에 여러개의 패키지를 설치하는 것을 지원하지 않는다고 함.
$ yarn lerna add @emotion/react --scope=@ks-design-system/ui
$ yarn lerna add @emotion/styled --scope=@ks-design-system/ui
$ yarn lerna add framer-motion --scope=@ks-design-system/ui
```

```js
// .storybook/main.js
const path = require('path');

const toPath = (_path) => path.join(process.cwd(), _path);

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
    config.module.rules.push({
      type: 'javascript/auto',
      test: /\.mjs$/,
      include: /node_modules/,
    });

    config.resolve.extensions.push('.ts', '.tsx');

    Object.assign(config.resolve.alias, {
      '@ks-design-system/ui': path.resolve(__dirname, '../packages/ui/src'),
      '@ks-design-system/utils': path.resolve(
        __dirname,
        '../packages/utils/src',
      ),
      '@emotion/core': toPath('node_modules/@emotion/react'),
    });

    return config;
  },
  framework: '@storybook/react',
};
```

### webpack -> rollup
```shell
# 롤업 설치
$ yarn add -DW rollup

# 바벨 설치
$ yarn add -DW @babel/core @babel/preset-env @babel/preset-react

# 롤업에서 바벨을 사용하게 해주는 플러그인도 설치
$ yarn add -DW @rollup/plugin-babel

# 롤업 타입스크립트 플러그인 설치
$ yarn add -DW @rollup/plugin-typescript

# 바벨에서도 이를 해석하게 추가
$ yarn add -DW @babel/preset-typescript

# minify
$ yarn add -DW rollup-plugin-terser

# peerDependency로 설치된 라이브러리의 코드가 번들링된 결과에 포함되지 않고, import 구문으로 불러와서 사용할 수 있게 만들어줍니다.
$ yarn add -DW rollup-plugin-peer-deps-external
```

```json
// packages/utils/package.json
// packages/ui/package.json
...
  "main": "build/index.js",
  "types": "build/index.d.ts",
  "scripts": {
    "build": "tsc --emitDeclarationOnly && rollup -c && rimraf .rollup.cache tsconfig.tsbuildinfo",
    "watch": "rollup -cw",
    "clean": "rimraf ./build tsconfig.tsbuildinfo .rollup.cache"
  },
...
```

```json
// packages/utils/tsconfig.json
// packages/ui/tsconfig.json
...
    "compilerOptions": {
        "declaration": true,
        "outDir": "build",
        "rootDir": "./src",
        "jsx": "react-jsx"
    }
...
```

```js
// packages/utils/rollup.config.js
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'build/dist/utils.cjs.js',
      format: 'cjs',
    },
    {
      file: 'build/dist/utils.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
    },
    {
      file: 'build/dist/utils.esm.js',
      format: 'es',
    },
    {
      file: 'build/dist/utils.esm.min.js',
      format: 'es',
      plugins: [terser()],
    },
    {
      dir: 'build',
      format: 'esm',
      sourcemap: 'inline',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: [
    // 바벨 트랜스파일러 설정
    babel({
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),

    peerDepsExternal(),
    // 타입스크립트
    typescript(),
  ],
};
```

```js
// packages/utils/rollup.config.js
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'build/dist/ui.cjs.js',
      format: 'cjs',
    },
    {
      file: 'build/dist/ui.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
    },
    {
      file: 'build/dist/ui.esm.js',
      format: 'es',
    },
    {
      file: 'build/dist/ui.esm.min.js',
      format: 'es',
      plugins: [terser()],
    },
    {
      dir: 'build',
      format: 'esm',
      sourcemap: 'inline',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: [
    // 바벨 트랜스파일러 설정
    babel({
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),

    peerDepsExternal(),
    typescript(),
  ],
};
```

```shell
# 불필요한 webpack 관련 패키지 제거
$ yarn remove -W ts-loader
# webpack.config.js 제거
$ rm -rf webpack.config.js
```
