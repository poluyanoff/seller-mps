import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const exec = promisify(execFile);
export async function installLibrary(cwd = process.cwd()) {
  const temp = await mkdtemp(join(tmpdir(), 'taiga-install-'));
  const run = (command, args, directory) => exec(command, args, { cwd: directory, timeout: 180000, maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never', GIT_SSH_COMMAND: 'ssh -oBatchMode=yes -oConnectTimeout=10' } });
  const files = ['package.json', 'package-lock.json'];
  const originals = await Promise.all(files.map(file => readFile(join(cwd, file))));
  let changed = false;
  try {
    const config = JSON.parse(await readFile(join(cwd, 'library.config.json'), 'utf8'));
    if (!config.repository || !config.ref || config.repository.startsWith('-') || config.ref.startsWith('-')) throw new Error();
    await run('git', ['init', '--quiet'], temp);
    await run('git', ['fetch', '--depth=1', '--', config.repository, config.ref], temp);
    await run('git', ['checkout', '--detach', 'FETCH_HEAD'], temp);
    const pkg = JSON.parse(await readFile(join(temp, 'package.json'), 'utf8'));
    if (pkg.name !== 'taiga-ui-proprietary' || !/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error();
    await run('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], temp);
    await run('npm', ['run', 'build'], temp);
    const { stdout } = await run('npm', ['pack', '--ignore-scripts', '--json'], temp);
    const archive = JSON.parse(stdout)[0].filename;
    const { stdout: revision } = await run('git', ['rev-parse', 'HEAD'], temp);
    const filename = `taiga-ui-proprietary-${pkg.version}-${revision.trim().slice(0, 12)}.tgz`;
    await copyFile(join(temp, archive), join(cwd, 'vendor', filename));
    changed = true;
    await run('npm', ['install', `./vendor/${filename}`, '--ignore-scripts', '--no-audit', '--no-fund'], cwd);
    return pkg.version;
  } catch {
    if (changed) {
      await Promise.all(files.map((file, i) => writeFile(join(cwd, file), originals[i])));
      try { await run('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], cwd); }
      catch { throw new Error('Не удалось восстановить библиотеку. Выполните npm ci в папке проекта.'); }
    }
    throw new Error('Не удалось обновить библиотеку. Проверьте сеть и доступ Git, затем повторите.');
  } finally { await rm(temp, { recursive: true, force: true }); }
}
