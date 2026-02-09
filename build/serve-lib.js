import * as esbuild from 'esbuild';
import { createBuildSettings } from './settings.js';

export const settings = createBuildSettings("src/ts/run.ts", { 
  minify: false,
  outfile: 'lib/index.js',
  
  format: 'esm',
});

const ctx = await esbuild.context(settings);
await ctx.watch();