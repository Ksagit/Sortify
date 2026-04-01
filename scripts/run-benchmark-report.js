const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

const ROOT_DIR = process.cwd();
const SUMMARY_HTML_PATH = path.join(
  ROOT_DIR,
  'benchmarks',
  'results',
  'summary',
  'index.html',
);

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function runCommand(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    ...options,
  });

  return new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

function startBackgroundCommand(command, args) {
  const child = spawn(command, args, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error(`Background process failed: ${command} ${args.join(' ')}`);
    console.error(error);
  });

  return child;
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve(response.statusCode && response.statusCode < 500);
    });

    request.on('error', () => resolve(false));
    request.setTimeout(2_000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await checkUrl(url)) {
      return;
    }

    await delay(1_000);
  }

  throw new Error(`Timed out waiting for server: ${url}`);
}

function stopChildProcess(child) {
  if (!child || child.killed) {
    return;
  }

  child.kill('SIGTERM');
}

async function main() {
  const backgroundProcesses = [];

  try {
    console.log('Starting React benchmark server...');
    const reactServer = startBackgroundCommand('pnpm', ['benchmark:serve:react']);
    backgroundProcesses.push(reactServer);

    console.log('Starting Angular benchmark server...');
    const angularServer = startBackgroundCommand('pnpm', ['benchmark:serve:angular']);
    backgroundProcesses.push(angularServer);

    console.log('Waiting for local benchmark servers...');
    await Promise.all([
      waitForServer('http://127.0.0.1:4173', 120_000),
      waitForServer('http://127.0.0.1:4200', 120_000),
    ]);

    console.log('Running benchmark scenarios...');
    await runCommand('pnpm', ['benchmark:render']);

    console.log('Generating visualization...');
    await runCommand('pnpm', ['benchmark:visualize']);

    console.log('Opening report...');
    await runCommand('open', [SUMMARY_HTML_PATH]);
  } finally {
    backgroundProcesses.forEach(stopChildProcess);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});