import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const exec = promisify(execFile);
export function compareVersions(a, b) {
  const parse = (value) => {
    if (!/^\d+\.\d+\.\d+$/.test(value)) throw new Error(`Неподдерживаемая версия: ${value}`);
    return value.split('.').map(Number);
  };
  const left = parse(a), right = parse(b);
  for (let i = 0; i < 3; i++) if (left[i] !== right[i]) return Math.sign(left[i] - right[i]);
  return 0;
}
export async function checkLibrary(cwd = process.cwd()) {
  let temp;
  try {
    const require = createRequire(join(cwd, 'package.json'));
    const installed = JSON.parse(await readFile(require.resolve('taiga-ui-proprietary/package.json'), 'utf8')).version;
    const config = JSON.parse(await readFile(join(cwd, 'library.config.json'), 'utf8'));
    if (!config.repository || !config.ref || config.repository.startsWith('-') || config.ref.startsWith('-')) throw new Error('Проверьте library.config.json');
    temp = await mkdtemp(join(tmpdir(), 'taiga-update-'));
    const git = (args) => exec('git', args, { cwd: temp, timeout: 15000, maxBuffer: 1024 * 1024, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never', GIT_SSH_COMMAND: 'ssh -oBatchMode=yes -oConnectTimeout=10' } });
    await git(['init', '--quiet']);
    await git(['fetch', '--quiet', '--depth=1', '--filter=blob:none', '--', config.repository, config.ref]);
    const { stdout } = await git(['show', 'FETCH_HEAD:package.json']);
    const latest = JSON.parse(stdout);
    if (latest.name !== 'taiga-ui-proprietary') throw new Error('В источнике нет пакета taiga-ui-proprietary');
    const comparison = compareVersions(latest.version, installed);
    const message = comparison > 0
      ? `Доступна Taiga UI ${latest.version}; установлена ${installed}. Соберите новый архив в репозитории библиотеки и установите его: npm install ./vendor/<новый-архив>.tgz`
      : comparison === 0 ? `Taiga UI ${installed}: версия актуальна.` : `Taiga UI ${installed}: версия новее ${latest.version} в источнике.`;
    console.log(message);
    return { status: comparison > 0 ? 'update' : comparison === 0 ? 'current' : 'ahead', installed, latest: latest.version };
  } catch {
    // Do not echo Git stderr: repository URLs can contain credentials.
    console.warn('Не удалось проверить версию Taiga UI. Проверьте сеть, доступ Git и library.config.json. Актуальность версии неизвестна.');
    return { status: 'unavailable' };
  } finally { if (temp) await rm(temp, { recursive: true, force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await checkLibrary();
  if (result.status === 'unavailable') process.exitCode = 1;
}
