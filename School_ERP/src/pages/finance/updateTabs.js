const fs = require('fs');
const path = require('path');

const tabsBlockRegex1 = /<div className=\"flex gap-4 border-b border-gray-200 overflow-x-auto pb-0\.5 text-\[13px\] font-semibold text-\[#5c6e81\] mb-6 hide-scroll print:hidden\">[\s\S]*?<\/div>/;

const tabsBlockRegex2 = /<div className=\"flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto text-xs font-semibold text-gray-600\">[\s\S]*?<\/div>/;

const importRegex = /import FinanceTabs from '\.\.\/\.\.\/components\/finance\/FinanceTabs';/;


const files = fs.readdirSync('.').filter(f => f.endsWith('.jsx'));
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (tabsBlockRegex1.test(content)) {
    content = content.replace(tabsBlockRegex1, '<FinanceTabs />');
    changed = true;
  }
  
  if (tabsBlockRegex2.test(content)) {
    content = content.replace(tabsBlockRegex2, '<FinanceTabs />');
    changed = true;
  }

  if (changed && !importRegex.test(content)) {
    // try to insert after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
       const endOfLastImport = content.indexOf('\n', lastImportIndex);
       content = content.slice(0, endOfLastImport + 1) + "import FinanceTabs from '../../components/finance/FinanceTabs';\n" + content.slice(endOfLastImport + 1);
    }
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Updated ' + file);
  }
}
console.log('Total updated: ' + count);
