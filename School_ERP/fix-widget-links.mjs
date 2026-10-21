import fs from 'fs';

const urlMap = {
  'Admissions': '/front-office/admission-enquiries',
  'Asset Management': '/asset-management/dashboard',
  'Accounts': '/accounts/dashboard',
  'Fee Summary': '/finance/dashboard',
  'Inventory': '/asset-management',
  'Parent Meetings': '/ptm/dashboard',
  'Attendance': '/students/attendance',
  'Fees & Finance': '/finance/dashboard',
  'Student Information': '/students/list',
  'Human Resource': '/hr/dashboard',
  'Birthdays': '/engagement/birthday-manager',
  'Official Notices': '/communicate/notice-board',
  'Academics': '/academics/dashboard',
  'Upcoming Events': '/communicate/events-holidays',
  'Examinations': '/assessment/dashboard',
  'Lesson Planner': '/lesson-planner/dashboard',
  'Digital Evaluation': '/osm-module/dashboard',
  'Study Center': '/study-center/dashboard',
  'Hostel': '/hostel/dashboard',
  'CBC Academics': '/cbc/dashboard'
};

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'src', 'components', 'main-dashboard');
const targetFiles = ['RowOne.jsx', 'RowFour.jsx', 'RowFive.jsx', 'RowSix.jsx', 'RowSeven.jsx', 'RowEight.jsx'];

const linkComponentStr = `const WidgetHeader = ({ title, icon: Icon, link }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-2">
      <div className="bg-[#1e3a5f] p-1.5 rounded-none text-white">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
    </div>
    {link ? (
      <Link to={link} className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </Link>
    ) : (
      <button className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </button>
    )}
  </div>
);`;

targetFiles.forEach(file => {
  const filePath = `${dir}/${file}`;
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Replace WidgetHeader definition
  const widgetHeaderRegex = /const WidgetHeader =.*?<\/div>\r?\n\);/s;
  content = content.replace(widgetHeaderRegex, linkComponentStr);

  // Auto-inject link="..." into <WidgetHeader title="..."/> calls
  Object.keys(urlMap).forEach(title => {
    const link = urlMap[title];
    const headerRegex = new RegExp(`(<WidgetHeader title="${title}"[^>]*)/>`, 'g');
    content = content.replace(headerRegex, (match, prefix) => {
      if (prefix.includes('link=')) return match;
      return `${prefix} link="${link}" />`;
    });
  });

  // Ensure Link is imported from react-router-dom
  if (content !== originalContent) {
    if (!content.includes('import { Link }') && !content.includes('import { Link,')) {
      if (content.includes(`react-router-dom`)) {
         content = content.replace(/import \{([^}]+)\} from 'react-router-dom';/, `import {$1, Link} from 'react-router-dom';`);
      } else {
         content = content.replace(/(import React[^;]+;)/, `$1\nimport { Link } from 'react-router-dom';`);
      }
    }
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
});
