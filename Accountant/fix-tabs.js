const fs = require('fs');

const paths = {
  'Dashboard': '/accounts/dashboard',
  'Collect Fees': '/fees/collect',
  'Search Due Fees': '/fees/due',
  'Assign Fees': '/fees/assign',
  'Fee Groups': '/fees/groups',
  'Fee Types': '/fees/types',
  'Income': '/accounts/income',
  'Expense': '/accounts/expense',
  'Income Heads': '/accounts/income-heads',
  'Expense Heads': '/accounts/expense-heads',
  'Day Book': '/accounts/day-book'
};

const dir = 'c:/Users/lOQ/Desktop/SCHOOL_ERP/Accountant/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => `${dir}/${f}`);

let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Add paths to tabs
  Object.keys(paths).forEach(label => {
    // Look for `{ label: 'LabelName', icon: SomeIcon }` or similar without `path:`
    const regex = new RegExp(`({[ \\t]*label:[ \\t]*'${label}'[ \\t]*,[ \\t]*icon:[ \\t]*[^,}]*)(,[ \\t]*active:[ \\t]*true)?([ \\t]*})`, 'g');
    content = content.replace(regex, `$1$2, path: '${paths[label]}' }`);
  });

  // Now replace the <div key={idx} renderer in the map function
  const divRegex = /<div key=\{idx\}([^>]+)>(.*?)<\/div>/gs;
  content = content.replace(divRegex, (match, attrs, inner) => {
    // Only replace if it's the tab map function
    if (attrs.includes('tab.active') && inner.includes('tab.label')) {
      return `<Link key={idx} to={tab.path || '#'} ${attrs}>${inner}</Link>`;
    }
    return match;
  });

  // Ensure Link is imported
  if (content !== originalContent) {
    if (!content.includes('import { Link }') && !content.includes('import { Link,')) {
      if (content.includes(`import { NavLink } from 'react-router-dom';`)) {
         content = content.replace(`import { NavLink } from 'react-router-dom';`, `import { NavLink, Link } from 'react-router-dom';`);
      } else if (content.includes(`react-router-dom`)) {
         content = content.replace(/import \{([^}]+)\} from 'react-router-dom';/, `import {$1, Link} from 'react-router-dom';`);
      } else {
         content = content.replace(/(import React[^;]+;)/, `$1\nimport { Link } from 'react-router-dom';`);
      }
    }
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
    fixedCount++;
  }
});
console.log('Total fixed:', fixedCount);
