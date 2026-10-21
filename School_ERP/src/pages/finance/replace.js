const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.jsx'));

const exactTabBlock1 = `      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-0.5 text-[13px] font-semibold text-[#5c6e81] mb-6 hide-scroll print:hidden">
        <style dangerouslySetInnerHTML={{__html: \`.hide-scroll::-webkit-scrollbar { display: none; }\`}} />
        <button className="text-[#15202b] border-b-[3px] border-[#15202b] pb-2 px-1 whitespace-nowrap flex items-center gap-1.5">
           <Gauge className="w-4 h-4" /> Dashboard
        </button>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <BookOpen className="w-4 h-4" /> Guide
        </button>
        <Link to="/finance/collect" className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <HandCoins className="w-4 h-4" /> Collect Fees
        </Link>
        <Link to="/finance/search-due-fees" className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <FileSearch className="w-4 h-4" /> Search Due Fees
        </Link>
        <Link to="/finance/transactions" className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <ArrowRightLeft className="w-4 h-4" /> All Transactions
        </Link>
        <Link to="/finance/online-transactions" className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <Globe className="w-4 h-4" /> Online Transactions
        </Link>
        <Link to="/finance/challans" className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <FileText className="w-4 h-4" /> Fee Challans
        </Link>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <UserPlus className="w-4 h-4" /> Assign Fees
        </button>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <WalletCards className="w-4 h-4" /> Fees Carry Forward
        </button>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <LayoutGrid className="w-4 h-4" /> Fee Groups
        </button>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <Percent className="w-4 h-4" /> Fees Discount
        </button>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <Hash className="w-4 h-4" /> Fee Types
        </button>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <Receipt className="w-4 h-4" /> Generate Due Slip
        </button>
        <button className="pb-2 px-1 whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 transition-colors">
           <Clock className="w-4 h-4" /> Due Slip History
        </button>
      </div>`;

// Some pages might not have `<Link>` for Search Due fees, or the active tab might be different. Let's just use string parsing to remove the div block.

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let startIdx1 = content.indexOf('<div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-0.5 text-[13px] font-semibold text-[#5c6e81] mb-6 hide-scroll print:hidden">');
  let startIdx2 = content.indexOf('<div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto text-xs font-semibold text-gray-600">');
  
  let p = startIdx1 !== -1 ? startIdx1 : startIdx2;
  
  if (p !== -1) {
    // Find the end </div> of this block.
    // Both of these specific tab blocks do NOT have nested <div>s. 
    // They just have <style>, <button>, <Link>, and <span> (maybe).
    // So the very next "</div>" after p is the end of the tabs block.
    
    let endIdx = content.indexOf('</div>', p);
    if (endIdx !== -1) {
      // The substring to replace is from p to endIdx + 6
      let toReplace = content.substring(p, endIdx + 6);
      content = content.replace(toReplace, '<FinanceTabs />');
      
      // Now add import if not exist
      if (!content.includes('import FinanceTabs')) {
          const lastImportIdx = content.lastIndexOf('import ');
          if (lastImportIdx !== -1) {
             const newlineIdx = content.indexOf('\\n', lastImportIdx) !== -1 ? content.indexOf('\\n', lastImportIdx) : content.indexOf('\n', lastImportIdx);
             content = content.slice(0, newlineIdx + 1) + "import FinanceTabs from '../../components/finance/FinanceTabs';\n" + content.slice(newlineIdx + 1);
          }
      }
      
      fs.writeFileSync(file, content, 'utf8');
      console.log('Replaced tabs in ' + file);
    }
  }
}
