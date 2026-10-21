const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'OnlineTransactions.jsx',
  'FeeChallans.jsx',
  'GenerateDueSlip.jsx',
  'FeeTypes.jsx',
  'FeesDiscount.jsx',
  'FeesCarryForward.jsx',
  'DueSlipHistory.jsx',
  'AssignFees.jsx',
  'AllTransactions.jsx'
];

const start1 = '<div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-0.5 text-[13px] font-semibold text-[#5c6e81] mb-6 hide-scroll print:hidden">';
const start2 = '<div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto text-xs font-semibold text-gray-600">';
const start3 = '<div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-0.5 text-[13px] font-semibold text-[#5c6e81] mb-6 hide-scroll">'; // for AllTransactions
const start4 = '<div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto text-xs font-semibold text-gray-600 print:hidden">'; // for DueSlipHistory

for (const file of filesToProcess) {
  try {
    const filePath = path.join('.', file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let p = content.indexOf(start1);
    if (p === -1) p = content.indexOf(start2);
    if (p === -1) p = content.indexOf(start3);
    if (p === -1) p = content.indexOf(start4);
    
    if (p !== -1) {
      const remaining = content.slice(p);
      // We look for Due Slip History</button>
      // or similar last element's closing tag, then the </div>
      const dueSlipIdx = remaining.indexOf('Due Slip History');
      if (dueSlipIdx === -1) { console.log('Could not find Due slip in ' + file); continue; }
      
      const lastButtonEnd = remaining.indexOf('</button>', dueSlipIdx);
      if (lastButtonEnd === -1) { console.log('Could not find </button> in ' + file); continue; }
      
      const divClosureIdx = remaining.indexOf('</div>', lastButtonEnd);
      if (divClosureIdx === -1) { console.log('Could not find </div> in ' + file); continue; }
      
      const blockLength = divClosureIdx + 6;
      const blockToReplace = remaining.slice(0, blockLength);
      
      content = content.replace(blockToReplace, '<FinanceTabs />');
      
      // add import
      if (!content.includes('import FinanceTabs')) {
         const lastImport = content.lastIndexOf('import ');
         const replaceIdx = content.indexOf('\n', lastImport);
         content = content.slice(0, replaceIdx + 1) + "import FinanceTabs from '../../components/finance/FinanceTabs';\n" + content.slice(replaceIdx + 1);
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Successfully updated ' + file);
    } else {
      console.log('No tab block found in ' + file);
    }
    
  } catch(e) {
    console.error('Error on ' + file + ':', e);
  }
}
