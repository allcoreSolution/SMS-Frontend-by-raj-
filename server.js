// server.js - Unified Production HTTP Server for all School ERP panels
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 5173;
const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Auto-build if dist does not exist
if (!fs.existsSync(DIST_DIR)) {
  console.log('📦 dist folder not found. Running node build_all.js first...');
  try {
    execSync('node build_all.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to run build_all.js:', err.message);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.apk': 'application/vnd.android.package-archive',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURIComponent(parsedUrl.pathname);

  // Determine which sub-app this request belongs to
  let panelSubdir = '';
  if (reqPath.startsWith('/admin')) panelSubdir = 'admin';
  else if (reqPath.startsWith('/teacher')) panelSubdir = 'teacher';
  else if (reqPath.startsWith('/accountant')) panelSubdir = 'accountant';
  else if (reqPath.startsWith('/student')) panelSubdir = 'student';
  else if (reqPath.startsWith('/driver')) panelSubdir = 'driver';
  else if (reqPath.startsWith('/superadmin')) panelSubdir = 'superadmin';
  else if (reqPath.startsWith('/branch')) panelSubdir = 'branch';

  // 1. Direct file lookup in dist
  const normalizedPath = reqPath.replace(/^\/+/, '');
  let filePath = path.join(DIST_DIR, normalizedPath);

  // Prevent path traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // If path is a directory, look for index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const dirIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(dirIndex)) {
      filePath = dirIndex;
    }
  }

  // If exact file exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isImmutable = reqPath.includes('/assets/') || ext === '.apk';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isImmutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 2. SPA Fallback routing
  let fallbackFile;
  if (panelSubdir) {
    fallbackFile = path.join(DIST_DIR, panelSubdir, 'index.html');
  }
  if (!fallbackFile || !fs.existsSync(fallbackFile)) {
    fallbackFile = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(fallbackFile)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    fs.createReadStream(fallbackFile).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('School ERP Portal: Page Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log(`🚀 Unified MultiSchool ERP Server Live on Port ${PORT}`);
  console.log(`🌐 Public URL: http://0.0.0.0:${PORT}/`);
  console.log('Available Panel Routes:');
  console.log(` - Landing:     /`);
  console.log(` - School Admin: /admin/`);
  console.log(` - Teacher:     /teacher/`);
  console.log(` - Accountant:  /accountant/`);
  console.log(` - Student:     /student/`);
  console.log(` - Driver:      /driver/`);
  console.log(` - SuperAdmin:  /superadmin/`);
  console.log(` - Branch Admin: /branch/`);
  console.log(` - APKs:        /apk/`);
  console.log('====================================================');
});

