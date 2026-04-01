const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const ROOT_DIR = process.cwd();
const RAW_DIR = path.join(ROOT_DIR, 'benchmarks', 'results', 'raw');
const SERIES_DIR = path.join(ROOT_DIR, 'benchmarks', 'results', 'series');
const runCount = Number(process.env.BENCHMARK_REPEAT_COUNT || process.argv[2] || 10);

function copyDirectory(sourceDir, targetDir) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });

  for (const fileName of fs.readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(targetDir, fileName);
    fs.copyFileSync(sourcePath, targetPath);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        return;
      }

      resolve();
    });
  });
}

async function main() {
  if (!Number.isInteger(runCount) || runCount <= 0) {
    throw new Error(`Invalid benchmark repeat count: ${runCount}`);
  }

  fs.mkdirSync(SERIES_DIR, { recursive: true });

  for (let index = 1; index <= runCount; index += 1) {
    const runId = `run-${String(index).padStart(2, '0')}`;
    console.log(`\n=== Benchmark series ${runId}/${`run-${String(runCount).padStart(2, '0')}`} ===`);
    await runCommand('pnpm', ['benchmark:render']);
    copyDirectory(RAW_DIR, path.join(SERIES_DIR, runId));
  }

  console.log(`Saved ${runCount} benchmark runs to ${SERIES_DIR}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});