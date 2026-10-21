const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Raj Yadav\\Downloads\\SCHOOL\\School-ERP\\Branch-Admin\\.chrome_temp';

console.log('Starting headless Chrome...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  'http://localhost:5174/'
]);

chrome.stderr.on('data', d => {});
chrome.stdout.on('data', d => {});

async function pollCDP() {
  for (let i = 0; i < 30; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9222/json/list', res => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
      });
      if (data && data.length > 0 && data[0].webSocketDebuggerUrl) {
        return data[0];
      }
    } catch (e) {
      // wait
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Chrome CDP timed out');
}

async function run() {
  try {
    const page = await pollCDP();
    console.log('Page target found:', page.title, page.url);
    console.log('WebSocket Debugger URL:', page.webSocketDebuggerUrl);

    // Use WebSocket to connect to CDP
    const WebSocket = require('stream'); // wait, does node have ws?
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    try { chrome.kill(); } catch (_) {}
  }
}
run();
