import * as esbuild from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

/* Собирает весь прототип в один HTML-файл: dist-single/prototype.html.
   JS, CSS, шрифты и картинки внутри. Открывается двойным кликом, без сервера.
   Плашка проверки ДС отключена. */
const result = await esbuild.build({
  entryPoints: ['screens/main.js'], bundle: true, write: false, outdir: 'out', entryNames: 'app',
  format: 'iife', minify: true, logLevel: 'info', loader: { '.png': 'dataurl' }
});
const js = result.outputFiles.find(f => f.path.endsWith('.js')).text.replace(/<\/script/gi, '<\\/script');
const css = result.outputFiles.find(f => f.path.endsWith('.css')).text;

let html = await readFile('index.html', 'utf8');
html = html
  .replace(' data-tui-check', '')
  .replace('<link rel="stylesheet" href="/app.css">', () => `<style>${css}</style>`)
  .replace('<script type="module" src="/app.js"></script>', () => `<script>${js}</script>`);

await mkdir('dist-single', { recursive: true });
await writeFile('dist-single/prototype.html', html);
console.log(`dist-single/prototype.html: ${(html.length / 1048576).toFixed(1)} МБ`);
