import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = fs.readFileSync(path.join(__dirname, 'src', 'App.jsx'), 'utf8');
const sidebar = fs.readFileSync(path.join(__dirname, 'src', 'components', 'layout', 'Sidebar.jsx'), 'utf8');
const routePaths = [...app.matchAll(/path=[\"']([^\"']+)[\"']/g)].map(m => m[1]);
const navPaths = [...sidebar.matchAll(/path:\s*[\"']([^\"']+)[\"']/g)].map(m => m[1]).filter(p => p !== '#');

// Check parameterized matches like /asset-management/:tab
function matchesRoute(navPath) {
  if (routePaths.includes(navPath)) return true;
  for (const r of routePaths) {
    if (r.includes(':')) {
      const regex = new RegExp('^' + r.replace(/:[^\/]+/g, '[^/]+') + '$');
      if (regex.test(navPath)) return true;
    }
  }
  return false;
}

const missing = [...new Set(navPaths.filter(p => !matchesRoute(p)))];
console.log('Real missing paths count:', missing.length);
console.log(missing);


