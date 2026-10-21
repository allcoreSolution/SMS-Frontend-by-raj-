// run_all.js - Launches all School ERP panels concurrently
const { spawn, execSync } = require('child_process');
const path = require('path');

const panels = [
  { name: 'MultiSchool Landing Web', dir: 'Multi_School_Erp', port: 5173, color: '\x1b[32m' },
  { name: 'Branch Admin Network', dir: 'Branch-Admin', port: 5174, color: '\x1b[33m' },
  { name: 'Student & Parent Portal', dir: 'Student_Parents', port: 5175, color: '\x1b[31m' },
  { name: 'Main School Admin ERP', dir: 'School_ERP', port: 5176, color: '\x1b[34m' },
  { name: 'Teacher & Staff Panel', dir: 'Teache_Panel', port: 5177, color: '\x1b[36m' },
  { name: 'Accountant & Fee Desk', dir: 'Accountant', port: 5178, color: '\x1b[35m' },
  { name: 'SuperAdmin SaaS Platform', dir: 'SuperAdmin', port: 5179, color: '\x1b[35m' },
];

console.log('\x1b[1m\x1b[33m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '   STARTING MULTISCHOOL ERP ECOSYSTEM (ALL 7 PANELS)  ');
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '=======================================================');
console.log('Main Landing Website: \x1b[1m\x1b[32mhttp://localhost:5173/\x1b[0m');
console.log('Starting all sub-panels in background...\n');

const isWindows = process.platform === 'win32';
const children = [];

panels.forEach(p => {
  const npmCmd = isWindows ? 'npm.cmd run dev' : 'npm run dev';
  const child = spawn(npmCmd, {
    cwd: path.join(__dirname, p.dir),
    stdio: 'pipe',
    shell: true
  });

  children.push(child);

  child.stdout.on('data', data => {
    const msg = data.toString();
    if (msg.includes('Local:') || msg.includes('ready in') || msg.includes('Network:')) {
      if (!p._ready) {
        p._ready = true;
        console.log(`${p.color}✓ [${p.name}]\x1b[0m Live -> \x1b[1mhttp://localhost:${p.port}/\x1b[0m`);
      }
    }
  });

  child.stderr.on('data', () => {});

  child.on('close', code => {
    if (code !== null && code !== 0) {
      console.log(`${p.color}[${p.name}]\x1b[0m stopped (code ${code})`);
    }
  });
});

const cleanup = () => {
  console.log('\nShutting down all panels...');
  children.forEach(c => {
    try {
      if (isWindows && c.pid) {
        execSync(`taskkill /pid ${c.pid} /f /t`, { stdio: 'ignore' });
      } else {
        c.kill('SIGINT');
      }
    } catch (_) {}
  });
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
