const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('====================================================');
console.log('🚀 Starting Unified School ERP Master Build on Render...');
console.log(`Repository Root: ${rootDir}`);
console.log(`Target Output:   ${distDir}`);
console.log('====================================================');

// Clean and recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to install & build a panel
function buildPanel(panelName, subpath, targetFolder) {
  console.log(`\n----------------------------------------------------`);
  console.log(`📦 Processing ${panelName} (Subpath: ${subpath})...`);
  const panelDir = path.join(rootDir, panelName);

  if (!fs.existsSync(panelDir)) {
    console.error(`❌ Directory not found: ${panelDir}`);
    return;
  }

  // Auto-install dependencies on fresh Render clone if node_modules missing
  const nodeModulesDir = path.join(panelDir, 'node_modules');
  if (!fs.existsSync(nodeModulesDir)) {
    console.log(`📥 Installing dependencies for ${panelName}...`);
    execSync('npm install --prefer-offline --no-audit --progress=false', {
      cwd: panelDir,
      stdio: 'inherit'
    });
  }

  // Run build
  console.log(`⚡ Building ${panelName}...`);
  execSync('npm run build', {
    cwd: panelDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_BASE_PATH: subpath,
      VITE_API_URL: process.env.VITE_API_URL || 'https://sms-backend-by-raj-1.onrender.com/api',
      VITE_BASE_URL: process.env.VITE_BASE_URL || 'https://sms-backend-by-raj-1.onrender.com',
    }
  });

  const panelDist = path.join(panelDir, 'dist');
  const destDir = targetFolder ? path.join(distDir, targetFolder) : distDir;

  if (fs.existsSync(panelDist)) {
    if (targetFolder) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.cpSync(panelDist, destDir, { recursive: true });
    } else {
      // Root app (Multi_School_Erp)
      fs.cpSync(panelDist, destDir, { recursive: true });
    }
    console.log(`✅ ${panelName} successfully copied to ${targetFolder ? 'dist/' + targetFolder : 'dist/'}`);
  } else {
    throw new Error(`Build failed: dist folder not found for ${panelName}`);
  }
}

// 1. Build Multi_School_Erp as root (/)
buildPanel('Multi_School_Erp', '/', '');

// 2. Build Sub-Apps into subfolders
buildPanel('School_ERP', '/admin/', 'admin');
buildPanel('Teache_Panel', '/teacher/', 'teacher');
buildPanel('Accountant', '/accountant/', 'accountant');
buildPanel('Student_Parents', '/student/', 'student');
buildPanel('Driver_Panel', '/driver/', 'driver');
buildPanel('SuperAdmin', '/superadmin/', 'superadmin');
buildPanel('Branch-Admin', '/branch/', 'branch');

// 3. Ensure APK files are in dist/apk
const apkDest = path.join(distDir, 'apk');
fs.mkdirSync(apkDest, { recursive: true });
const parentDir = path.join(rootDir, '..');
['Teacher.apk', 'Driver.apk', 'Student_Parents.apk', 'Accountant.apk'].forEach(apk => {
  const src1 = path.join(parentDir, apk);
  const src2 = path.join(rootDir, 'Multi_School_Erp', 'public', 'apk', apk);
  const target = path.join(apkDest, apk);
  if (fs.existsSync(src1)) {
    fs.copyFileSync(src1, target);
  } else if (fs.existsSync(src2)) {
    fs.copyFileSync(src2, target);
  }
});
console.log('✅ Android APKs copied to dist/apk/');

console.log('\n====================================================');
console.log('🎉 ALL 8 PANELS UNIFIED BUILD COMPLETE!');
console.log('Single distribution folder ready at dist:');
console.log(' - /            -> Multi_School_Erp (Landing Hub)');
console.log(' - /admin/      -> School_ERP (Admin Master ERP)');
console.log(' - /teacher/    -> Teache_Panel (Teacher & Staff)');
console.log(' - /accountant/ -> Accountant (Fee Collection)');
console.log(' - /student/    -> Student_Parents (Student & Parent)');
console.log(' - /driver/     -> Driver_Panel (Driver Telematics)');
console.log(' - /superadmin/ -> SuperAdmin (SaaS Multi-Tenant)');
console.log(' - /branch/     -> Branch-Admin (Branch Network)');
console.log(' - /apk/        -> Android APKs');
console.log('====================================================');
