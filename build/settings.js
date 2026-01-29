import esbuildPluginTsc from 'esbuild-plugin-tsc';

export function createBuildSettings(entryPoint, options) {
  return {
    entryPoints: [entryPoint],
    outfile: 'dist/bundle.js',
    bundle: true,
    format: 'esm',
    plugins: [
      esbuildPluginTsc({
        force: true
      }),
    ],
    ...options
  };
}