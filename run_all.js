// run_all.js - Launches all School ERP panels + Central Backend API concurrently
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const panels = [
  { name: 'MultiSchool Landing Web', dir: 'Multi_School_Erp', port: 5173, color: '\x1b[32m' },
  { name: 'Branch Admin Network', dir: 'Branch-Admin', port: 5174, color: '\x1b[33m' },
  { name: 'Student & Parent Portal', dir: 'Student_Parents', port: 5175, color: '\x1b[31m' },
  { name: 'Main School Admin ERP', dir: 'School_ERP', port: 5176, color: '\x1b[34m' },
  { name: 'Teacher & Staff Panel', dir: 'Teache_Panel', port: 5177, color: '\x1b[36m' },
  { name: 'Accountant & Fee Desk', dir: 'Accountant', port: 5178, color: '\x1b[35m' },
  { name: 'SuperAdmin SaaS Platform', dir: 'SuperAdmin', port: 5179, color: '\x1b[35m' },
  { name: 'Driver & Transport Portal', dir: 'Driver_Panel', port: 5180, color: '\x1b[33m' },
];

console.log('\x1b[1m\x1b[33m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '   STARTING MULTISCHOOL ERP ECOSYSTEM (API + 8 PANELS)');
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '=======================================================');
console.log('Main Landing Website: \x1b[1m\x1b[32mhttp://localhost:5173/\x1b[0m');
console.log('Starting all sub-panels & backend in background...\n');

const isWindows = process.platform === 'win32';
const children = [];

// 1. Launch Central Backend API (Port 5050) if exists
const apiDir = path.join(__dirname, '..', 'School_ERP_Api');
if (fs.existsSync(apiDir)) {
  const apiChild = spawn('node server.js', {
    cwd: apiDir,
    stdio: 'pipe',
    shell: true
  });
  children.push(apiChild);

  let apiLogged = false;
  apiChild.stdout.on('data', data => {
    const msg = data.toString();
    if ((msg.includes('5050') || msg.includes('MongoDB Connected')) && !apiLogged) {
      apiLogged = true;
      console.log(`\x1b[32m✓ [Central Backend API]\x1b[0m Live -> \x1b[1mhttp://localhost:5050/api/\x1b[0m`);
    }
  });

  apiChild.stderr.on('data', data => {
    const msg = data.toString();
    if (msg.includes('EADDRINUSE')) {
      if (!apiLogged) {
        apiLogged = true;
        console.log(`\x1b[32m✓ [Central Backend API]\x1b[0m Already running -> \x1b[1mhttp://localhost:5050/api/\x1b[0m`);
      }
    }
  });
}

// 2. Launch all 7 frontend panels
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
  console.log('\nShutting down all panels & backend...');
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
