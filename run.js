import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('================================================================');
console.log('🏛️  Starting MyLocal Services (B.Sc. CS Sem V CEP Full Stack)   ');
console.log('================================================================');

// 1. Start Backend Server
const backend = spawn(npmCmd, ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Dev Server
const frontend = spawn(npmCmd, ['run', 'dev', '--', '--host'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nStopping MyLocal Services servers...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
