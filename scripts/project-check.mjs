#!/usr/bin/env node
// Verifica o projeto e mantém o bloco AUTO do CLAUDE.md sincronizado.
// Modos: --sync | --hook (Stop hook do Claude Code) | --precommit | --full
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';

const ROOT = process.cwd();
const CLAUDE_MD = join(ROOT, 'CLAUDE.md');
const START = '<!-- AUTO:START (gerado por scripts/project-check.mjs — não edite à mão) -->';
const END = '<!-- AUTO:END -->';
const mode = process.argv[2] ?? '--sync';

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const srcFiles = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p))
  .filter((p) => !p.startsWith('src/assets/'))
  .sort();

const testFiles = srcFiles.filter((f) => f.startsWith('src/__tests__/'));
const countTests = (f) => (readFileSync(join(ROOT, f), 'utf8').match(/^\s*it\(/gm) ?? []).length;
const testCounts = testFiles.map((f) => [f, countTests(f)]);
const totalTests = testCounts.reduce((n, [, c]) => n + c, 0);

const eventsSrc = readFileSync(join(ROOT, 'src/data/events.ts'), 'utf8');
const eventCount = (eventsSrc.match(/^\s+id: '/gm) ?? []).length;
const withImage = (eventsSrc.match(/imageUrl:/g) ?? []).length;
const googleThumbs = (eventsSrc.match(/encrypted-tbn0\.gstatic\.com/g) ?? []).length;

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const codeFiles = srcFiles.filter((f) => /\.(tsx?|css)$/.test(f) && !f.startsWith('src/__tests__/'));
const allText = srcFiles
  .filter((f) => /\.(tsx?|css)$/.test(f))
  .map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]);
const ENTRYPOINTS = new Set(['src/main.tsx', 'src/vite-env.d.ts', 'src/setupTests.ts']);
const unused = codeFiles.filter((f) => {
  if (ENTRYPOINTS.has(f)) return false;
  const file = basename(f).replace(/\.(tsx?|css)$/, '');
  const stem = file === 'index' && !f.endsWith('.css') ? basename(dirname(f)) : file;
  const ref = f.endsWith('.css')
    ? new RegExp(`['"/]${stem}\\.css['"]`)
    : new RegExp(`['"/]${stem}(\\.tsx?)?['"]`);
  return !allText.some(([other, text]) => other !== f && ref.test(text));
});

const hash = createHash('sha1')
  .update(JSON.stringify({ srcFiles, testCounts, scripts: pkg.scripts }))
  .digest('hex')
  .slice(0, 10);

const block = [
  START,
  `<!-- structure-hash: ${hash} -->`,
  '## Snapshot automático',
  '',
  `- **Eventos mock:** ${eventCount} (${withImage} com \`imageUrl\`, ${googleThumbs} são miniaturas do Google)`,
  `- **Testes:** ${totalTests} em ${testFiles.length} arquivos — ${testCounts
    .map(([f, c]) => `${basename(f)} (${c})`)
    .join(', ')}`,
  `- **Scripts npm:** ${Object.keys(pkg.scripts).map((s) => `\`${s}\``).join(', ')}`,
  `- **Arquivos possivelmente não usados:** ${unused.length ? unused.map((f) => `\`${f}\``).join(', ') : 'nenhum'}`,
  '',
  '```',
  ...srcFiles.filter((f) => !f.endsWith('.css')),
  '```',
  END,
].join('\n');

const current = existsSync(CLAUDE_MD) ? readFileSync(CLAUDE_MD, 'utf8') : '';
const re = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END}`);
const prevHash = current.match(/structure-hash: (\w+)/)?.[1];
const next = re.test(current) ? current.replace(re, block) : `${current.trimEnd()}\n\n${block}\n`;
const stale = next !== current;
const structureChanged = prevHash !== hash;

const run = (cmd, args) => spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });
const fail = (msg) => {
  process.stderr.write(`${msg}\n`);
  process.exit(mode === '--full' ? 1 : 2);
};

if (mode === '--precommit') {
  if (stale) {
    process.stderr.write('CLAUDE.md está desatualizado. Rode: npm run docs:sync  (e git add CLAUDE.md)\n');
    process.exit(1);
  }
} else if (stale) {
  writeFileSync(CLAUDE_MD, next);
  console.log('CLAUDE.md: bloco automático atualizado.');
}

if (mode === '--sync') process.exit(0);

if (mode === '--hook') {
  let stopActive = false;
  try {
    stopActive = JSON.parse(readFileSync(0, 'utf8') || '{}').stop_hook_active === true;
  } catch {}
  const dirty = execSync('git status --porcelain -- src package.json', { cwd: ROOT, encoding: 'utf8' }).trim();
  if (!dirty) process.exit(0);
  const problems = [];
  const tsc = run('npx', ['tsc', '--noEmit']);
  if (tsc.status !== 0) problems.push(`tsc falhou:\n${(tsc.stdout + tsc.stderr).slice(0, 1500)}`);
  const tests = run('npx', ['vitest', '--run']);
  if (tests.status !== 0) problems.push(`testes falharam:\n${(tests.stdout + tests.stderr).slice(-1500)}`);
  if (structureChanged && !stopActive) {
    problems.push(
      'A estrutura do projeto mudou desde o último sync (arquivos/testes/scripts). O bloco automático do CLAUDE.md já foi regenerado; ' +
        'revise agora as seções narrativas (Arquitetura, Componentes, Testes, Dívidas conhecidas) e corrija o que ficou desatualizado. ' +
        'Não rode git commit — o usuário commita manualmente.',
    );
  }
  // Na segunda passada (stop_hook_active) não bloqueia de novo, para evitar loop.
  if (problems.length && !stopActive) fail(problems.join('\n\n'));
  process.exit(0);
}

// --precommit e --full: checagens completas
const problems = [];
const tsc = run('npx', ['tsc', '--noEmit']);
if (tsc.status !== 0) problems.push(`tsc falhou:\n${tsc.stdout}${tsc.stderr}`);
const tests = run('npx', ['vitest', '--run']);
if (tests.status !== 0) problems.push(`testes falharam:\n${tests.stdout.slice(-1500)}${tests.stderr}`);

if (mode === '--full') {
  const audit = run('npm', ['audit', '--json']);
  try {
    const v = JSON.parse(audit.stdout).metadata.vulnerabilities;
    console.log(`npm audit: critical=${v.critical} high=${v.high} moderate=${v.moderate} low=${v.low}`);
    if (v.critical + v.high > 0) problems.push('npm audit: há vulnerabilidades critical/high (rode npm audit fix).');
  } catch {
    console.log('npm audit: não foi possível ler o resultado (offline?).');
  }
  const gitignore = existsSync(join(ROOT, '.gitignore')) ? readFileSync(join(ROOT, '.gitignore'), 'utf8') : '';
  for (const entry of ['node_modules', 'dist', '.env']) {
    if (!gitignore.includes(entry)) problems.push(`.gitignore não contém "${entry}".`);
  }
  const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter((f) => /(^|\/)\.env|\.(pem|key|secret)$/.test(f));
  if (tracked.length) problems.push(`arquivos sensíveis versionados: ${tracked.join(', ')}`);
  const risky = run('grep', ['-rnE', 'dangerouslySetInnerHTML|innerHTML\\s*=|document\\.write|eval\\(|new Function\\(', 'src']);
  if (risky.stdout.trim()) problems.push(`padrões de XSS/injeção encontrados:\n${risky.stdout}`);
  if (unused.length) console.log(`aviso: arquivos possivelmente não usados: ${unused.join(', ')}`);
}

if (problems.length) {
  process.stderr.write(`\n${problems.join('\n\n')}\n`);
  process.exit(1);
}
console.log('OK: tipos, testes e CLAUDE.md em dia.');
