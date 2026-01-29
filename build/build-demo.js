import * as esbuild from 'esbuild';
import { createBuildSettings } from './settings.js';

import { copyFiles } from './copy.js'
copyFiles()

const settings = createBuildSettings("src/index.ts", { minify: true });

await esbuild.build(settings);