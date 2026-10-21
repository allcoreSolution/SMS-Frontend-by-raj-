const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempDir = path.join(__dirname, 'chrome_profile');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  `--user-data-dir=${tempDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--disable-extensions',
  'http://localhost:5174/'
]);

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getCDPTarget() {
  for (let i = 0; i < 20; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9222/json/list', res => {
          let b = '';
          res.on('data', c => b += c);
          res.on('end', () => resolve(JSON.parse(b)));
        }).on('error', reject);
      });
      const pageTarget = data && data.find(t => t.type === 'page');
      if (pageTarget) return pageTarget;
    } catch (_) {}
    await sleep(400);
  }
  throw new Error('Chrome did not respond on 9222');
}

async function run() {
  try {
    const target = await getCDPTarget();
    console.log('Connecting to Chrome CDP target:', target.title, target.url);
    console.log('WebSocket URL:', target.webSocketDebuggerUrl);

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded') {
        console.log('[BROWSER CONSOLE]', msg.params.message.level, msg.params.message.text);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        console.log('[CONSOLE API]', msg.params.type, text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log('[BROWSER EXCEPTION]', JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    console.log('Enabling Runtime, Console and Page...');
    await send('Runtime.enable');
    await send('Console.enable');
    await send('Page.enable');

    console.log('Waiting 5 seconds for page load and execution...');
    await sleep(5000);

    const evalResult = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        url: window.location.href,
        rootChildren: document.getElementById('root')?.children.length,
        rootText: document.getElementById('root')?.innerText?.slice(0, 500),
        rootHTML: document.getElementById('root')?.innerHTML?.slice(0, 500),
        hasError: !!document.querySelector('.text-xl'),
        bodyText: document.body?.innerText?.slice(0, 500)
      })`,
      returnByValue: true
    });

    console.log('\n--- EVALUATION RESULT ---');
    console.log(JSON.stringify(evalResult?.result?.value, null, 2));

    ws.close();
  } catch (e) {
    console.error('Test error:', e);
  } finally {
    try { chrome.kill(); } catch (_) {}
    process.exit(0);
  }
}

run();
