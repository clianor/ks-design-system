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
