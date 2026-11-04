import * as esbuild from 'esbuild';
import { mkdir, copyFile, readFile, rm } from 'node:fs/promises';
import { createServer, request } from 'node:http';
import { installLibrary } from './library-install.mjs';
import { checkLibrary } from './library-check.mjs';

await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await copyFile('index.html', 'dist/index.html');
const options = { entryPoints: ['screens/main.js'], bundle: true, outdir: 'dist', entryNames: 'app', format: 'esm', logLevel: 'info', loader: { '.png': 'dataurl' } };
if (process.argv.includes('--build')) {
  await esbuild.build({ ...options, minify: true });
} else {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: 'dist', host: '127.0.0.1' });
  let installing = false;
  const server = createServer(async (req, res) => {
    if (req.url?.split('?')[0] !== '/api/library') {
      const proxy = request({ hostname: '127.0.0.1', port, path: req.url, method: req.method, headers: req.headers }, upstream => {
        res.writeHead(upstream.statusCode, upstream.headers); upstream.pipe(res);
      });
      proxy.on('error', () => { res.statusCode = 502; res.end(); });
      req.pipe(proxy); return;
    }
    const reply = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
    const host = req.headers.host;
    if (!/^127\.0\.0\.1:\d+$/.test(host || '')) return reply(403, {});
    if (req.method === 'GET') return reply(200, await checkLibrary());
    if (req.method !== 'POST') return reply(405, {});
    if (req.headers.origin !== `http://${host}` || req.headers['x-library-action'] !== 'install') return reply(403, {});
    if (installing) return reply(409, { message: 'Обновление уже выполняется.' });
    installing = true;
    try {
      const version = await installLibrary();
      await ctx.rebuild();
      reply(200, { version });
    } catch (error) { reply(500, { message: error.message }); }
    finally { installing = false; }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  console.log(`\nПрототип: http://127.0.0.1:${server.address().port}\nИзмените screens/main.js и обновите страницу.\n`);
  let checking = false;
  const check = async () => {
    if (checking) return;
    checking = true;
    try { await checkLibrary(); } finally { checking = false; }
  };
  void check();
  const config = JSON.parse(await readFile('library.config.json', 'utf8'));
  const minutes = Number(config.intervalMinutes);
  const timer = setInterval(() => void check(), (Number.isFinite(minutes) && minutes >= 1 ? minutes : 15) * 60000);
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => {
    clearInterval(timer);
    server.close();
    await ctx.dispose();
    process.exit();
  });
}
