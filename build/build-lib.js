import * as esbuild from 'esbuild';
import { createBuildSettings } from './settings.js';

import { copyFiles } from './copy.js'
copyFiles()

const settings = createBuildSettings("src/ts/run.ts", { 
  minify: false,
  
  format: 'esm',
});

await esbuild.build(settings);