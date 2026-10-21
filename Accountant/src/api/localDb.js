/**
 * LocalStorage-based database with automatic central MongoDB backend synchronization.
 * Keys are namespaced under "acc_".
 */
import axiosInstance from './axios';

const PREFIX = 'acc_';

const seed = {
  feeTypes: [
    { id: 'ft1', feeType: 'Tuition Fee', feeCode: 'TF', description: 'Monthly tuition charges' },
    { id: 'ft2', feeType: 'Transport Fee', feeCode: 'TR', description: 'School bus transport' },
    { id: 'ft3', feeType: 'Library Fee', feeCode: 'LB', description: 'Annual library membership' },
    { id: 'ft4', feeType: 'Exam Fee', feeCode: 'EX', description: 'Examination charges' },
  ],
  feeGroups: [
    { 
      id: 'fg1', 
      name: 'Class 1 Fees', 
      code: 'C1', 
      description: 'Fee structure for Class 1 Primary Section', 
      amount: 15000, 
      total: 15000, 
      details: [
        { name: 'Tuition Fee', amount: 10500, due: '10th of Month', demand: 'Monthly' },
        { name: 'Activity / Dev Fee', amount: 4500, due: 'Term End', demand: 'Quarterly' }
      ] 
    },
    { 
      id: 'fg2', 
      name: 'Class 2 Fees', 
      code: 'C2', 
      description: 'Fee structure for Class 2 Primary Section', 
      amount: 16000, 
      total: 16000, 
      details: [
        { name: 'Tuition Fee', amount: 11000, due: '10th of Month', demand: 'Monthly' },
        { name: 'Activity & Lab Fee', amount: 5000, due: 'Term End', demand: 'Quarterly' }
      ] 
    },
    { 
      id: 'fg3', 
      name: 'Class 10 Fees', 
      code: 'C10', 
      description: 'Board Exam & Secondary Academic Fee Structure', 
      amount: 25000, 
      total: 25000, 
      details: [
        { name: 'Tuition Fee', amount: 18000, due: '10th of Month', demand: 'Monthly' },
        { name: 'Science Lab & Board Exam Fee', amount: 7000, due: 'Term End', demand: 'Half Yearly' }
      ] 
    },
    { 
      id: 'fg4', 
      name: 'Transport & Bus Fee', 
      code: 'BUS', 
      description: 'Standard City Route School Bus Transportation Package', 
      amount: 12000, 
      total: 12000, 
      details: [
        { name: 'Transport Route Fee', amount: 12000, due: 'Term Start', demand: 'Quarterly' }
      ] 
    },
  ],
  incomeHeads: [
    { id: 'ih1', name: 'Tuition Fee Collection', code: 'TFC', description: 'Regular student academic & tuition collection' },
    { id: 'ih2', name: 'Alumni & Trust Donation', code: 'DN', description: 'Voluntary donations and endowment grants' },
    { id: 'ih3', name: 'Bank Interest & Fixed Deposit', code: 'IN', description: 'Quarterly interest accrued from operational accounts' },
    { id: 'ih4', name: 'Admission & Prospectus Sale', code: 'ADM', description: 'Application registration fees and prospectus sales' },
    { id: 'ih5', name: 'Uniform & Stationery Counter', code: 'STN', description: 'School supplies, badges, and school store revenue' },
    { id: 'ih6', name: 'Cafeteria & Canteen Royalty', code: 'CAN', description: 'Monthly canteen lease and contractor royalty' },
  ],
  expenseHeads: [
    { id: 'eh1', name: 'Staff & Faculty Salaries', code: 'SL', description: 'Monthly payroll for teaching & non-teaching staff' },
    { id: 'eh2', name: 'Campus Utilities & Power', code: 'UT', description: 'Electricity, clean water, high-speed fiber internet' },
    { id: 'eh3', name: 'Facility & Lab Maintenance', code: 'MT', description: 'Building repairs, painting, AC and lab servicing' },
    { id: 'eh4', name: 'Printing & Exam Stationery', code: 'PRN', description: 'Answer booklets, exam question papers, certificates' },
    { id: 'eh5', name: 'Sports & Annual Function', code: 'SPT', description: 'Sports equipment, tournament entries, cultural events' },
    { id: 'eh6', name: 'Transportation & Fuel', code: 'TRN', description: 'Diesel for school buses and vehicle fitness certifications' },
  ],
  incomes: [
    // May 2026
    { id: 'in_m1', head: 'Tuition Fee Collection', name: 'May Term Fee Batch', amount: 165000, date: '2026-05-10', paymentMode: 'Bank Transfer', note: 'May tuition installment', invoiceNo: 'INC-0501' },
    { id: 'in_m2', head: 'Admission & Prospectus Sale', name: 'New Session Prospectus Sales', amount: 35000, date: '2026-05-18', paymentMode: 'Cash', note: '70 prospectus forms', invoiceNo: 'INC-0502' },
    // June 2026
    { id: 'in_j1', head: 'Tuition Fee Collection', name: 'June Academic Fee Collection', amount: 195000, date: '2026-06-08', paymentMode: 'UPI', note: 'Summer term clearing', invoiceNo: 'INC-0601' },
    { id: 'in_j2', head: 'Uniform & Stationery Counter', name: 'Annual Book Set Sales', amount: 48000, date: '2026-06-22', paymentMode: 'Bank Transfer', note: 'New textbooks and diaries', invoiceNo: 'INC-0602' },
    // July 2026
    { id: 'in_jl1', head: 'Tuition Fee Collection', name: 'July Term Fee Collection', amount: 240000, date: '2026-07-05', paymentMode: 'Bank Transfer', note: 'Q2 major collection', invoiceNo: 'INC-0701' },
    { id: 'in_jl2', head: 'Alumni & Trust Donation', name: 'Patel Trust Laboratory Grant', amount: 65000, date: '2026-07-16', paymentMode: 'Cheque', note: 'Robotics lab infrastructure grant', invoiceNo: 'INC-0702' },
    // August 2026
    { id: 'in_a1', head: 'Tuition Fee Collection', name: 'August Tuition Batch', amount: 215000, date: '2026-08-08', paymentMode: 'UPI', note: 'Regular fee collections', invoiceNo: 'INC-0801' },
    { id: 'in_a2', head: 'Bank Interest & Fixed Deposit', name: 'Quarterly FD Interest Credit', amount: 18500, date: '2026-08-25', paymentMode: 'Bank Transfer', note: 'Reserve deposit interest', invoiceNo: 'INC-0802' },
    // September 2026
    { id: 'in_s1', head: 'Tuition Fee Collection', name: 'September Term Clearance', amount: 270000, date: '2026-09-06', paymentMode: 'Bank Transfer', note: 'Pre-exam fee clearing', invoiceNo: 'INC-0901' },
    { id: 'in_s2', head: 'Cafeteria & Canteen Royalty', name: 'Q2 Canteen Lease Revenue', amount: 30000, date: '2026-09-20', paymentMode: 'Cheque', note: 'Concessionaire royalty', invoiceNo: 'INC-0902' },
    // October 2026
    { id: 'in1', head: 'Tuition Fee Collection', name: 'October Tuition Batch A', amount: 145000, date: '2026-10-02', paymentMode: 'Bank Transfer', note: 'Primary section batch collection', invoiceNo: 'INC-1001' },
    { id: 'in2', head: 'Alumni & Trust Donation', name: 'S. K. Foundation Endowment', amount: 50000, date: '2026-10-04', paymentMode: 'Cheque', note: 'Annual scholarship corpus donation', invoiceNo: 'INC-1002' },
    { id: 'in3', head: 'Admission & Prospectus Sale', name: 'Front Desk Admission Forms', amount: 18500, date: '2026-10-07', paymentMode: 'Cash', note: '37 new application prospectus forms sold', invoiceNo: 'INC-1003' },
    { id: 'in4', head: 'Bank Interest & Fixed Deposit', name: 'State Bank Interest Credit', amount: 12400, date: '2026-10-09', paymentMode: 'Bank Transfer', note: 'Q3 interest on reserve FD account', invoiceNo: 'INC-1004' },
    { id: 'in5', head: 'Uniform & Stationery Counter', name: 'School Store Sale Receipts', amount: 22000, date: '2026-10-11', paymentMode: 'UPI', note: 'Mid-term uniform and workbook sales', invoiceNo: 'INC-1005' },
    { id: 'in6', head: 'Cafeteria & Canteen Royalty', name: 'Campus Cafeteria Monthly Rent', amount: 15000, date: '2026-10-12', paymentMode: 'UPI', note: 'October concessionaire lease fee', invoiceNo: 'INC-1006' },
  ],
  expenses: [
    // May 2026
    { id: 'ex_m1', head: 'Staff & Faculty Salaries', name: 'April Staff Payroll', amount: 110000, date: '2026-05-02', paymentMode: 'Bank Transfer', note: 'Faculty salary clearance', voucherNo: 'EXP-0501' },
    { id: 'ex_m2', head: 'Campus Utilities & Power', name: 'Electricity Board Power Bill', amount: 16500, date: '2026-05-14', paymentMode: 'UPI', note: 'Campus energy consumption', voucherNo: 'EXP-0502' },
    // June 2026
    { id: 'ex_j1', head: 'Staff & Faculty Salaries', name: 'May Staff Payroll', amount: 115000, date: '2026-06-02', paymentMode: 'Bank Transfer', note: 'Monthly faculty salary', voucherNo: 'EXP-0601' },
    { id: 'ex_j2', head: 'Facility & Lab Maintenance', name: 'Annual Campus Whitewash & Repairs', amount: 38000, date: '2026-06-15', paymentMode: 'Cheque', note: 'Summer vacation facility upkeep', voucherNo: 'EXP-0602' },
    // July 2026
    { id: 'ex_jl1', head: 'Staff & Faculty Salaries', name: 'June Staff Payroll', amount: 120000, date: '2026-07-02', paymentMode: 'Bank Transfer', note: 'Teaching staff payroll', voucherNo: 'EXP-0701' },
    { id: 'ex_jl2', head: 'Printing & Exam Stationery', name: 'Annual Academic Calendars & Workbooks', amount: 45000, date: '2026-07-12', paymentMode: 'Cheque', note: 'Offset printing invoices', voucherNo: 'EXP-0702' },
    // August 2026
    { id: 'ex_a1', head: 'Staff & Faculty Salaries', name: 'July Staff Payroll', amount: 122000, date: '2026-08-02', paymentMode: 'Bank Transfer', note: 'Staff salary disbursement', voucherNo: 'EXP-0801' },
    { id: 'ex_a2', head: 'Transportation & Fuel', name: 'School Bus Fleet Diesel IOCL', amount: 36000, date: '2026-08-14', paymentMode: 'Bank Transfer', note: 'Monthly fuel expense', voucherNo: 'EXP-0802' },
    // September 2026
    { id: 'ex_s1', head: 'Staff & Faculty Salaries', name: 'August Staff Payroll', amount: 124000, date: '2026-09-02', paymentMode: 'Bank Transfer', note: 'Faculty salary transfer', voucherNo: 'EXP-0901' },
    { id: 'ex_s2', head: 'Printing & Exam Stationery', name: 'Term Exam Answer Sheets & Question Papers', amount: 28000, date: '2026-09-18', paymentMode: 'UPI', note: 'Mid-term printing supplies', voucherNo: 'EXP-0902' },
    // October 2026
    { id: 'ex1', head: 'Staff & Faculty Salaries', name: 'September Teaching Staff Payroll', amount: 125000, date: '2026-10-01', paymentMode: 'Bank Transfer', note: 'Salary disbursement batch 1', voucherNo: 'EXP-2001' },
    { id: 'ex2', head: 'Campus Utilities & Power', name: 'State Electricity Board Bill', amount: 18450, date: '2026-10-03', paymentMode: 'UPI', note: 'Substation energy meter billing', voucherNo: 'EXP-2002' },
    { id: 'ex3', head: 'Transportation & Fuel', name: 'IOCL Fuel Station Fleet Refuel', amount: 32000, date: '2026-10-06', paymentMode: 'Bank Transfer', note: 'Diesel for 6 school buses', voucherNo: 'EXP-2003' },
    { id: 'ex4', head: 'Facility & Lab Maintenance', name: 'Physics & Chemistry Lab Chemicals', amount: 9800, date: '2026-10-08', paymentMode: 'Cash', note: 'Annual consumable glasswares & reagents', voucherNo: 'EXP-2004' },
    { id: 'ex5', head: 'Printing & Exam Stationery', name: 'Modern Offset Printers', amount: 14500, date: '2026-10-10', paymentMode: 'Cheque', note: 'Mid-term examination sheets and report cards', voucherNo: 'EXP-2005' },
    { id: 'ex6', head: 'Sports & Annual Function', name: 'Inter-School Sports Meet Supplies', amount: 8200, date: '2026-10-12', paymentMode: 'Cash', note: 'Footballs, badminton nets & trophy sets', voucherNo: 'EXP-2006' },
  ],
  students: [
    { id: 'st1', name: 'Aarav Sharma', class: '10-A', roll: '101', admNo: 'ADM-1001', father: 'Ramesh Sharma', mother: 'Sunita Sharma', phone: '9876543210', email: 'aarav.s@gmail.com', gender: 'Male', dob: '2010-05-14', due: 5000, totalFee: 25000, admissionDate: '2020-04-10', status: 'Active', address: 'B-12, Sector 15, Rohini' },
    { id: 'st2', name: 'Priya Patel', class: '9-B', roll: '205', admNo: 'ADM-1002', father: 'Suresh Patel', mother: 'Geeta Patel', phone: '9876543211', email: 'priya.patel@gmail.com', gender: 'Female', dob: '2011-08-22', due: 0, totalFee: 22000, admissionDate: '2021-04-12', status: 'Active', address: '45, Shalimar Bagh, Delhi' },
    { id: 'st3', name: 'Ishaan Gupta', class: '8-A', roll: '312', admNo: 'ADM-1003', father: 'Vikram Gupta', mother: 'Pooja Gupta', phone: '9876543212', email: 'ishaan.g@gmail.com', gender: 'Male', dob: '2012-02-18', due: 2500, totalFee: 20000, admissionDate: '2022-04-15', status: 'Active', address: 'Pocket C, Mayur Vihar, Delhi' },
    { id: 'st4', name: 'Ananya Singh', class: '10-B', roll: '118', admNo: 'ADM-1004', father: 'Amit Singh', mother: 'Reena Singh', phone: '9876543213', email: 'ananya.singh@gmail.com', gender: 'Female', dob: '2010-11-03', due: 7500, totalFee: 25000, admissionDate: '2020-04-10', status: 'Active', address: 'H-302, Green Park, New Delhi' },
    { id: 'st5', name: 'Aditya Verma', class: '10-A', roll: '102', admNo: 'ADM-1005', father: 'Sunil Verma', mother: 'Kavita Verma', phone: '9811223344', email: 'aditya.v@gmail.com', gender: 'Male', dob: '2010-07-29', due: 12000, totalFee: 25000, admissionDate: '2020-04-10', status: 'Active', address: 'Flat 4A, Model Town, Delhi' },
    { id: 'st6', name: 'Meera Rajput', class: '9-A', roll: '201', admNo: 'ADM-1006', father: 'Devendra Rajput', mother: 'Radha Rajput', phone: '9822334455', email: 'meera.r@gmail.com', gender: 'Female', dob: '2011-09-12', due: 4500, totalFee: 22000, admissionDate: '2021-04-12', status: 'Active', address: '78, Civil Lines, North Delhi' },
    { id: 'st7', name: 'Kabir Das', class: '8-A', roll: '315', admNo: 'ADM-1007', father: 'Anand Das', mother: 'Neelam Das', phone: '9833445566', email: 'kabir.das@gmail.com', gender: 'Male', dob: '2012-04-05', due: 8000, totalFee: 20000, admissionDate: '2022-04-15', status: 'Active', address: 'D-55, Lajpat Nagar, New Delhi' },
    { id: 'st8', name: 'Diya Kapoor', class: '7-B', roll: '402', admNo: 'ADM-1008', father: 'Rajan Kapoor', mother: 'Meenakshi Kapoor', phone: '9844556677', email: 'diya.k@gmail.com', gender: 'Female', dob: '2013-01-19', due: 3000, totalFee: 18000, admissionDate: '2023-04-11', status: 'Active', address: '12-A, Vasant Kunj, Delhi' },
    { id: 'st9', name: 'Yuvraj Singh', class: '6-A', roll: '501', admNo: 'ADM-1009', father: 'Harpreet Singh', mother: 'Simran Kaur', phone: '9855667788', email: 'yuvraj.s@gmail.com', gender: 'Male', dob: '2014-06-25', due: 15000, totalFee: 18000, admissionDate: '2024-04-09', status: 'Active', address: 'Block 8, Janakpuri, West Delhi' },
    { id: 'st10', name: 'Tanvi Joshi', class: '10-A', roll: '103', admNo: 'ADM-1010', father: 'Prakash Joshi', mother: 'Sarita Joshi', phone: '9866778899', email: 'tanvi.j@gmail.com', gender: 'Female', dob: '2010-12-14', due: 0, totalFee: 25000, admissionDate: '2020-04-10', status: 'Active', address: '304, Preet Vihar, East Delhi' },
    { id: 'st11', name: 'Rohan Mehta', class: '2-A', roll: '601', admNo: 'ADM-1011', father: 'Girish Mehta', mother: 'Bhavna Mehta', phone: '9877889900', email: 'rohan.m@gmail.com', gender: 'Male', dob: '2018-03-10', due: 4000, totalFee: 16000, admissionDate: '2025-04-08', status: 'Active', address: 'A-19, Paschim Vihar, Delhi' },
    { id: 'st12', name: 'Sanya Mirza', class: '1-A', roll: '702', admNo: 'ADM-1012', father: 'Imran Mirza', mother: 'Shabana Mirza', phone: '9888990011', email: 'sanya.m@gmail.com', gender: 'Female', dob: '2019-07-04', due: 0, totalFee: 15000, admissionDate: '2026-04-05', status: 'Active', address: '55, Okhla Vihar, New Delhi' },
    { id: 'st13', name: 'Vihaan Malhotra', class: '2-B', roll: '608', admNo: 'ADM-1013', father: 'Sanjay Malhotra', mother: 'Alka Malhotra', phone: '9899001122', email: 'vihaan.m@gmail.com', gender: 'Male', dob: '2018-10-15', due: 6500, totalFee: 16000, admissionDate: '2025-04-08', status: 'Active', address: '22, Saket Block E, Delhi' },
    { id: 'st14', name: 'Kavya Reddy', class: '1-B', roll: '710', admNo: 'ADM-1014', father: 'Nagaraj Reddy', mother: 'Padma Reddy', phone: '9810111213', email: 'kavya.r@gmail.com', gender: 'Female', dob: '2019-11-20', due: 2000, totalFee: 15000, admissionDate: '2026-04-05', status: 'Active', address: 'G-14, Dwarka Sector 11, Delhi' },
    { id: 'st15', name: 'Reyansh Tiwari', class: '6-B', roll: '512', admNo: 'ADM-1015', father: 'Manoj Tiwari', mother: 'Shalini Tiwari', phone: '9821222324', email: 'reyansh.t@gmail.com', gender: 'Male', dob: '2014-08-30', due: 0, totalFee: 18000, admissionDate: '2024-04-09', status: 'Active', address: '67, Ashok Vihar Phase 2, Delhi' },
    { id: 'st16', name: 'Anvi Deshmukh', class: 'Nursery-A', roll: '801', admNo: 'ADM-1016', father: 'Sachin Deshmukh', mother: 'Rupali Deshmukh', phone: '9832333435', email: 'anvi.d@gmail.com', gender: 'Female', dob: '2021-04-11', due: 3500, totalFee: 14000, admissionDate: '2026-04-01', status: 'Active', address: 'Tower 4, Greater Kailash 1' },
  ],
  collections: [
    { id: 'col1', studentId: 'st2', studentName: 'Priya Patel', className: '9-B', amount: 16000, date: '2026-09-15', mode: 'UPI', receipt: 'RCP-1001' },
    { id: 'col2', studentId: 'st1', studentName: 'Aarav Sharma', className: '10-A', amount: 7000, date: '2026-10-02', mode: 'Cash', receipt: 'RCP-1002' },
    { id: 'col3', studentId: 'st4', studentName: 'Ananya Singh', className: '10-B', amount: 4500, date: '2026-10-08', mode: 'Bank Transfer', receipt: 'RCP-1003' },
    { id: 'col4', studentId: 'st10', studentName: 'Tanvi Joshi', className: '10-A', amount: 12000, date: '2026-10-10', mode: 'Cheque', receipt: 'RCP-1004' },
  ],
  profile: {
    name: 'Rajesh Kumar',
    staffId: 'STF-003',
    role: 'Accountant',
    designation: 'Staff',
    department: 'Finance',
    basicSalary: '35000',
    dateOfJoining: '2020-06-15',
    email: 'accountant@allcoresolution.com',
    phone: '9876501234',
    address: '12, Green Park, New Delhi',
    bio: 'Experienced school accountant with 6+ years.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  calendarEvents: [
    { id: 'ev1', date: '2026-10-02', title: 'Gandhi Jayanti (Holiday)', color: '#dd4b39', category: 'Holiday', time: 'Full Day' },
    { id: 'ev2', date: '2026-10-05', title: 'Q3 Tuition Fee Due Date', color: '#00a65a', category: 'Fee Deadline', time: '10:00 AM' },
    { id: 'ev3', date: '2026-10-10', title: 'Academic Planning & Staff Meeting', color: '#3c8dbc', category: 'Meeting', time: '02:30 PM' },
    { id: 'ev4', date: '2026-10-12', title: 'Inter-School Science Olympiad', color: '#605ca8', category: 'Academic', time: '09:00 AM' },
    { id: 'ev5', date: '2026-10-15', title: 'Mid-Term Examinations Begin', color: '#f39c12', category: 'Exam', time: '08:30 AM' },
    { id: 'ev6', date: '2026-10-21', title: 'Mid-Term Examinations Conclude', color: '#f39c12', category: 'Exam', time: '01:00 PM' },
    { id: 'ev7', date: '2026-10-23', title: 'Dussehra & Vijayadashami Break', color: '#dd4b39', category: 'Holiday', time: 'Full Day' },
    { id: 'ev8', date: '2026-10-26', title: 'Staff Festive Bonus Disbursement', color: '#00a65a', category: 'Finance', time: '11:00 AM' },
    { id: 'ev9', date: '2026-10-29', title: 'Diwali Festival Holidays', color: '#dd4b39', category: 'Holiday', time: 'Full Day' },
    { id: 'ev10', date: '2026-10-31', title: 'Parent-Teacher Meeting (PTM)', color: '#00c0ef', category: 'Meeting', time: '09:00 AM' },
    { id: 'ev11', date: '2026-11-06', title: 'Annual Sports Trials', color: '#00a65a', category: 'Sports', time: '03:00 PM' },
    { id: 'ev12', date: '2026-11-14', title: "Children's Day Special Assembly", color: '#e83e8c', category: 'Event', time: '08:30 AM' },
  ],
  leaves: [
    {
      id: 'lv1',
      type: 'Medical Leave',
      payType: 'Unpaid (LOP)',
      dates: '04 Sep, 2026 - 04 Sep, 2026',
      days: 1.0,
      reason: 'Not well',
      status: 'Approved'
    }
  ],
  loans: [
    {
      id: 'ln_001',
      _id: 'ln_001',
      type: 'Personal Loan',
      applicantName: 'Rajesh Kumar (Accountant)',
      amount: 25000,
      tenureMonths: 10,
      duration: '10 Months',
      emi: 2500,
      remaining: 15000,
      paidAmount: 10000,
      purpose: 'Home renovation and emergency expenses',
      reason: 'Home renovation and emergency expenses',
      status: 'Active',
      date: '2026-08-10',
    },
    {
      id: 'ln_002',
      _id: 'ln_002',
      type: 'Salary Advance',
      applicantName: 'Rajesh Kumar (Accountant)',
      amount: 10000,
      tenureMonths: 5,
      duration: '5 Months',
      emi: 2000,
      remaining: 10000,
      paidAmount: 0,
      purpose: 'Festival advance for Diwali shopping',
      reason: 'Festival advance for Diwali shopping',
      status: 'Pending',
      date: '2026-10-05',
    }
  ],
  leadSources: [
    { id: 'ls1', name: 'Direct Enquiry', description: 'Walk-in or direct front-office enquiry' },
    { id: 'ls2', name: 'Website Registration', description: 'Leads registered through school admission portal' },
    { id: 'ls3', name: 'Facebook Ads', description: 'Social media admission campaign leads' },
    { id: 'ls4', name: 'Reference', description: 'Referred by existing parents or staff' },
    { id: 'ls5', name: 'Education Fair', description: 'Annual local education fair contacts' },
  ],
  leads: [
    {
      id: 'ld1',
      name: 'Rahul Sharma',
      phone: '9876543210',
      email: 'rahul.parent@gmail.com',
      source: 'Facebook Ads',
      status: 'New',
      grade: 'Class 5',
      notes: 'Interested in CBSE curriculum and school bus facility.',
      date: '2026-10-10'
    },
    {
      id: 'ld2',
      name: 'Priya Singh',
      phone: '9876509876',
      email: 'priya@email.com',
      source: 'Direct Enquiry',
      status: 'Converted',
      grade: 'Class 1',
      notes: 'Fee structure discussed and admission form collected.',
      date: '2026-10-08'
    },
    {
      id: 'ld3',
      name: 'Aakash Tiwari',
      phone: '9812345678',
      email: 'aakash.tiwari@outlook.com',
      source: 'Website Registration',
      status: 'Following Up',
      grade: 'Class 8',
      notes: 'Followed up via call. Parent requested campus tour on Saturday.',
      date: '2026-10-11'
    },
    {
      id: 'ld4',
      name: 'Sanjana Verma',
      phone: '9898989898',
      email: 'sanjana.v@yahoo.com',
      source: 'Reference',
      status: 'New',
      grade: 'Nursery',
      notes: 'Sibling already studying in Class 4.',
      date: '2026-10-12'
    },
    {
      id: 'ld5',
      name: 'Rohit Kumar',
      phone: '9765432109',
      email: 'rohit.kumar@gmail.com',
      source: 'Education Fair',
      status: 'Application Sent',
      grade: 'Class 10',
      notes: 'Admission test scheduled for next week.',
      date: '2026-10-09'
    }
  ],
  notificationsList: [
    {
      id: 'notif_1',
      title: 'Fee Payment Received',
      message: 'Online payment of ₹16,000 received for Priya Patel (Class 9-B). Computerized Receipt #RCP-1001 generated.',
      category: 'finance',
      priority: 'normal',
      timestamp: '10 mins ago',
      datetime: '2026-10-12 16:35:00',
      read: false,
      actionUrl: '/fees/collect',
      metadata: { student: 'Priya Patel', class: '9-B', amount: 16000, receipt: 'RCP-1001' }
    },
    {
      id: 'notif_2',
      title: 'Emergency Fee Due Alert',
      message: 'Class 10 Quarter 2 fee payment deadline ends in 3 days. 14 students have pending dues.',
      category: 'finance',
      priority: 'urgent',
      timestamp: '45 mins ago',
      datetime: '2026-10-12 15:50:00',
      read: false,
      actionUrl: '/fees/due',
      metadata: { class: 'Class 10', pendingCount: 14 }
    },
    {
      id: 'notif_3',
      title: 'Leave Request Approved',
      message: 'Casual leave application for Mathematics Faculty (Vikram Mehra) has been approved by Principal.',
      category: 'hr',
      priority: 'normal',
      timestamp: '2 hours ago',
      datetime: '2026-10-12 14:15:00',
      read: false,
      actionUrl: '/leave',
      metadata: { staff: 'Vikram Mehra', type: 'Casual Leave' }
    },
    {
      id: 'notif_4',
      title: 'Daily Cashbook Reconciliation Ready',
      message: 'Day Book for 12 October 2026 has been balanced. Total Collections: ₹42,500 | Disbursements: ₹18,450.',
      category: 'finance',
      priority: 'success',
      timestamp: '3 hours ago',
      datetime: '2026-10-12 13:00:00',
      read: false,
      actionUrl: '/accounts/day-book',
      metadata: { collection: 42500, expense: 18450, balance: 24050 }
    },
    {
      id: 'notif_5',
      title: 'Automated Cloud Database Backup Completed',
      message: 'System database snapshot #BK-20261012 exported successfully (124 KB stored).',
      category: 'system',
      priority: 'normal',
      timestamp: '5 hours ago',
      datetime: '2026-10-12 11:30:00',
      read: true,
      actionUrl: '/settings',
      metadata: { size: '124 KB', version: 'v2.5.0' }
    },
    {
      id: 'notif_6',
      title: 'Half-Yearly Examination Timetable Published',
      message: 'Academic department has published the revised timetable for Classes 6 to 10.',
      category: 'academic',
      priority: 'normal',
      timestamp: 'Yesterday at 04:30 PM',
      datetime: '2026-10-11 16:30:00',
      read: true,
      actionUrl: '/accounts/dashboard',
      metadata: { session: '2026-2027', term: 'Half-Yearly' }
    },
    {
      id: 'notif_7',
      title: 'New Admission Lead Converted',
      message: 'Lead "Sanjana Verma" (Nursery) marked as Converted. Student admission form completed.',
      category: 'academic',
      priority: 'success',
      timestamp: 'Yesterday at 11:15 AM',
      datetime: '2026-10-11 11:15:00',
      read: true,
      actionUrl: '/leads/pipeline',
      metadata: { lead: 'Sanjana Verma', grade: 'Nursery' }
    },
    {
      id: 'notif_8',
      title: 'Security Alert: Sign-in from New Device',
      message: 'Accountant portal signed in from iPad Pro (Mobile Safari) from IP 103.21.58.42.',
      category: 'system',
      priority: 'high',
      timestamp: '2 days ago',
      datetime: '2026-10-10 18:22:00',
      read: true,
      actionUrl: '/settings',
      metadata: { device: 'iPad Pro', ip: '103.21.58.42' }
    },
    {
      id: 'notif_9',
      title: 'Staff Loan Installment Deducted',
      message: 'Monthly loan EMI of ₹5,000 processed for Teacher Rajesh Sharma (Slip #LN-892).',
      category: 'hr',
      priority: 'normal',
      timestamp: '3 days ago',
      datetime: '2026-10-09 10:00:00',
      read: true,
      actionUrl: '/loans',
      metadata: { amount: 5000, staff: 'Rajesh Sharma' }
    },
    {
      id: 'notif_10',
      title: 'Electricity & Power Bill Due Tomorrow',
      message: 'Campus energy voucher #EXP-2002 for ₹18,450 is scheduled for payment clearance.',
      category: 'finance',
      priority: 'urgent',
      timestamp: '3 days ago',
      datetime: '2026-10-09 09:30:00',
      read: true,
      actionUrl: '/accounts/expense',
      metadata: { voucher: 'EXP-2002', amount: 18450 }
    }
  ],
  settings: {
    appearance: {
      themeMode: 'light',
      accentColor: '#3c8dbc',
      primaryColorName: 'Classic Blue',
      layoutDensity: 'comfortable',
      fontSize: 'sm',
      currencySymbol: '₹',
      dateFormat: 'DD/MM/YYYY',
      schoolName: 'Oxford International Public School',
      schoolTagline: 'Excellence in Education & Character Building',
      academicSession: '2026-2027',
    },
    notifications: {
      feePaymentSms: true,
      feePaymentEmail: true,
      feeDueAlerts: true,
      dueNoticeDays: 3,
      leaveStatusAlerts: true,
      dailyExpenseReport: false,
      inAppSounds: true,
      pushBanners: true,
      smsProvider: 'MSG91 (Govt DLT Approved)',
      senderId: 'OXFRDS',
      smsBalance: 4850,
      emailHost: 'smtp.sendgrid.net',
      supportEmail: 'accounts@oxfordpublic.edu.in',
    },
    security: {
      twoFactorAuth: false,
      twoFactorMethod: 'authenticator',
      sessionTimeoutMinutes: 30,
      forcePasswordChangeDays: 90,
      loginAlerts: true,
      ipWhitelistEnabled: false,
      ipWhitelist: '192.168.1.1, 10.0.0.12',
      twoFactorSecret: 'JBSWY3DPEHPK3PXP',
      activeSessions: [
        { id: 'sess_1', device: 'Windows 11 (Google Chrome v124)', ip: '192.168.1.104', location: 'New Delhi, India', current: true, loginTime: '2026-10-12 09:15 AM' },
        { id: 'sess_2', device: 'iPad Pro (Mobile Safari)', ip: '103.21.58.42', location: 'Noida, UP, India', current: false, loginTime: '2026-10-11 04:30 PM' },
        { id: 'sess_3', device: 'Accountant Desktop - Counter 2 (Firefox)', ip: '192.168.1.118', location: 'Campus Intranet', current: false, loginTime: '2026-10-09 11:20 AM' },
      ],
    },
    database: {
      autoBackup: 'Weekly',
      lastBackupDate: '2026-10-10 18:30:00',
      cloudSync: true,
      retentionDays: 365,
    },
    advanced: {
      apiBaseUrl: 'http://localhost:5000/api',
      mockDataEngine: true,
      debugLogging: false,
      fiscalYearStart: 'April',
      feeReceiptPrefix: 'REC-2026/',
      voucherPrefix: 'EXP-2026/',
      receiptFooterNote: 'Fees once paid are non-refundable. Please retain this computerized receipt for tax exemption and audit purposes.',
      schoolGstNumber: '07AAAAA1234A1Z5',
      panNumber: 'AAATC1234F',
      auditTrailEnabled: true,
      roundOffDecimals: 2,
    },
  },
};

function getKey(collection) {
  return PREFIX + collection;
}

function read(collection) {
  try {
    const raw = localStorage.getItem(getKey(collection));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 0 && seed[collection] && seed[collection].length > 0) {
        write(collection, seed[collection]);
        return JSON.parse(JSON.stringify(seed[collection]));
      }
      if (collection === 'students') {
        if (!Array.isArray(parsed) || parsed.length < seed.students.length) {
          write(collection, seed.students);
          return JSON.parse(JSON.stringify(seed.students));
        }
        return parsed.map((s, idx) => ({
          ...s,
          admNo: s.admNo || `ADM-${1000 + idx + 1}`,
          gender: s.gender || (idx % 2 === 0 ? 'Male' : 'Female'),
          totalFee: s.totalFee || (Number(s.due || 0) + 15000),
          admissionDate: s.admissionDate || '2026-04-10',
          status: s.status || 'Active',
          mother: s.mother || '—',
          address: s.address || 'Delhi NCR Campus Route',
        }));
      }
      if ((collection === 'incomes' || collection === 'expenses' || collection === 'incomeHeads' || collection === 'expenseHeads' || collection === 'calendarEvents' || collection === 'notificationsList') && Array.isArray(parsed) && parsed.length < seed[collection].length) {
        write(collection, seed[collection]);
        return JSON.parse(JSON.stringify(seed[collection]));
      }
      if (collection === 'feeGroups') {
        if (!Array.isArray(parsed) || parsed.length === 0) {
          write(collection, seed.feeGroups);
          return JSON.parse(JSON.stringify(seed.feeGroups));
        }
        const normalized = parsed.map((item, idx) => ({
          ...item,
          id: item.id || item._id || `fg_${idx + 1}`,
          _id: item._id || item.id || `fg_${idx + 1}`,
          name: item.name || `Fee Group ${idx + 1}`,
          code: item.code || 'FG',
          amount: Number(item.total ?? item.amount ?? 0),
          total: Number(item.total ?? item.amount ?? 0),
          details: Array.isArray(item.details) && item.details.length > 0 ? item.details : [
            { name: 'Tuition Fee', amount: Math.round(Number(item.total ?? item.amount ?? 0) * 0.7) || Number(item.total ?? item.amount ?? 0), due: '10th of Month', demand: 'Monthly' },
            { name: 'Activity / Dev Fee', amount: Math.round(Number(item.total ?? item.amount ?? 0) * 0.3) || 0, due: 'Term End', demand: 'Quarterly' }
          ]
        }));
        return normalized;
      }
      return parsed;
    }
  } catch (_) {}
  // seed on first access
  const data = seed[collection] ? JSON.parse(JSON.stringify(seed[collection])) : [];
  write(collection, data);
  return data;
}

function write(collection, data) {
  localStorage.setItem(getKey(collection), JSON.stringify(data));
}

function genId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const localDb = {
  // generic helpers
  getAll(collection) {
    return read(collection);
  },
  getById(collection, id) {
    return read(collection).find((x) => x.id === id || x._id === id) || null;
  },
  create(collection, item) {
    const list = read(collection);
    const newItem = { ...item, id: item.id || genId(collection.slice(0, 2)), _id: item.id || genId(collection.slice(0, 2)) };
    list.push(newItem);
    write(collection, list);
    this._syncMutation('create', collection, newItem);
    return newItem;
  },
  update(collection, id, updates) {
    const list = read(collection);
    const idx = list.findIndex((x) => x.id === id || x._id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, id: list[idx].id || id, _id: list[idx]._id || id };
    write(collection, list);
    this._syncMutation('update', collection, list[idx]);
    return list[idx];
  },
  remove(collection, id) {
    const list = read(collection);
    const target = list.find((x) => x.id === id || x._id === id);
    const filtered = list.filter((x) => x.id !== id && x._id !== id);
    write(collection, filtered);
    if (target) {
      this._syncMutation('delete', collection, target);
    }
    return true;
  },

  // Central MongoDB Backend Synchronization
  async _syncMutation(action, collection, item) {
    try {
      const id = item._id || item.id;
      if (collection === 'feeTypes') {
        if (action === 'create') await axiosInstance.post('/fee-types', { name: item.feeType || item.name, code: item.feeCode || item.code, description: item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/fee-types/${id}`, { name: item.feeType || item.name, code: item.feeCode || item.code, description: item.description });
        else if (action === 'delete' && id) await axiosInstance.delete(`/fee-types/${id}`);
      } else if (collection === 'feeGroups') {
        if (action === 'create') await axiosInstance.post('/fee-groups', { name: item.name, description: item.description, amount: item.total || item.amount });
        else if (action === 'update' && id) await axiosInstance.put(`/fee-groups/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/fee-groups/${id}`);
      } else if (collection === 'incomes') {
        if (action === 'create') await axiosInstance.post('/incomes', { name: item.name || item.title || item.note, amount: item.amount, date: item.date, invoiceNumber: item.invoiceNo, paymentMode: item.mode || 'Cash', description: item.note || item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/incomes/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/incomes/${id}`);
      } else if (collection === 'incomeHeads') {
        if (action === 'create') await axiosInstance.post('/income-heads', { name: item.name || item.head, description: item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/income-heads/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/income-heads/${id}`);
      } else if (collection === 'expenses') {
        if (action === 'create') await axiosInstance.post('/expenses', { name: item.name || item.title || item.note, amount: item.amount, date: item.date, invoiceNumber: item.invoiceNo, paymentMode: item.mode || 'Cash', description: item.note || item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/expenses/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/expenses/${id}`);
      } else if (collection === 'expenseHeads') {
        if (action === 'create') await axiosInstance.post('/expense-heads', { name: item.name || item.head, description: item.description });
        else if (action === 'update' && id) await axiosInstance.put(`/expense-heads/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/expense-heads/${id}`);
      } else if (collection === 'students') {
        if (action === 'create') await axiosInstance.post('/students', item);
        else if (action === 'update' && id) await axiosInstance.put(`/students/${id}`, item);
        else if (action === 'delete' && id) await axiosInstance.delete(`/students/${id}`);
      } else if (collection === 'collections') {
        if (action === 'create') await axiosInstance.post('/collect-fees', item);
      }
    } catch (err) {
      // Gracefully silent on network failure - local state already saved
      console.warn('Backend sync mutation notice:', err.message);
    }
  },

  async syncFromBackend() {
    try {
      const [feeTypesRes, feeGroupsRes, studentsRes, incomesRes, expensesRes, incomeHeadsRes, expenseHeadsRes] = await Promise.allSettled([
        axiosInstance.get('/fee-types'),
        axiosInstance.get('/fee-groups'),
        axiosInstance.get('/students'),
        axiosInstance.get('/incomes'),
        axiosInstance.get('/expenses'),
        axiosInstance.get('/income-heads'),
        axiosInstance.get('/expense-heads')
      ]);

      if (feeTypesRes.status === 'fulfilled' && feeTypesRes.value.data?.data?.length > 0) {
        const mapped = feeTypesRes.value.data.data.map(ft => ({
          id: ft._id,
          _id: ft._id,
          feeType: ft.name || ft.feeType,
          feeCode: ft.code || ft.feeCode || '',
          description: ft.description || ''
        }));
        write('feeTypes', mapped);
      }

      if (feeGroupsRes.status === 'fulfilled' && feeGroupsRes.value.data?.data?.length > 0) {
        const mapped = feeGroupsRes.value.data.data.map(fg => ({
          id: fg._id,
          _id: fg._id,
          name: fg.name,
          code: fg.code || fg.name?.slice(0, 3).toUpperCase(),
          description: fg.description || '',
          amount: fg.amount || fg.total || 0,
          total: fg.total || fg.amount || 0,
          details: fg.feeTypes || []
        }));
        write('feeGroups', mapped);
      }

      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.data?.length > 0) {
        const mapped = studentsRes.value.data.data.map(s => ({
          id: s._id,
          _id: s._id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || 'Student',
          class: s.classId?.className || s.class || 'Class 1',
          roll: s.admissionNo || s.aparId || s.roll || `STU-${s._id.slice(-4)}`,
          father: s.fatherName || s.father || '',
          phone: s.phone || s.studentPhone || '',
          due: Number(s.due || 0)
        }));
        write('students', mapped);
      }

      if (incomesRes.status === 'fulfilled' && incomesRes.value.data?.data?.length > 0) {
        const mapped = incomesRes.value.data.data.map(inc => ({
          id: inc._id,
          _id: inc._id,
          head: inc.incomeHead?.name || inc.name || 'General Income',
          note: inc.description || inc.name || '',
          amount: inc.amount,
          date: inc.date ? new Date(inc.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          invoiceNo: inc.invoiceNumber || `INC-${inc._id.slice(-5)}`,
          mode: inc.paymentMode || 'Cash'
        }));
        write('incomes', mapped);
      }

      if (expensesRes.status === 'fulfilled' && expensesRes.value.data?.data?.length > 0) {
        const mapped = expensesRes.value.data.data.map(exp => ({
          id: exp._id,
          _id: exp._id,
          head: exp.expenseHead?.name || exp.name || 'General Expense',
          note: exp.description || exp.name || '',
          amount: exp.amount,
          date: exp.date ? new Date(exp.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          invoiceNo: exp.invoiceNumber || `EXP-${exp._id.slice(-5)}`,
          mode: exp.paymentMode || 'Cash'
        }));
        write('expenses', mapped);
      }

      if (incomeHeadsRes.status === 'fulfilled' && incomeHeadsRes.value.data?.data?.length > 0) {
        const mapped = incomeHeadsRes.value.data.data.map(h => ({
          id: h._id,
          _id: h._id,
          name: h.name,
          description: h.description || ''
        }));
        write('incomeHeads', mapped);
      }

      if (expenseHeadsRes.status === 'fulfilled' && expenseHeadsRes.value.data?.data?.length > 0) {
        const mapped = expenseHeadsRes.value.data.data.map(h => ({
          id: h._id,
          _id: h._id,
          name: h.name,
          description: h.description || ''
        }));
        write('expenseHeads', mapped);
      }

      return true;
    } catch (e) {
      console.warn('Initial sync notice:', e.message);
      return false;
    }
  },

  // convenience
  getProfile() {
    try {
      const raw = localStorage.getItem(getKey('profile'));
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const p = { ...seed.profile };
    localStorage.setItem(getKey('profile'), JSON.stringify(p));
    return p;
  },
  saveProfile(data) {
    localStorage.setItem(getKey('profile'), JSON.stringify(data));
    return data;
  },

  getEvents() {
    return read('calendarEvents');
  },
  addEvent(event) {
    return this.create('calendarEvents', event);
  },
  removeEvent(id) {
    return this.remove('calendarEvents', id);
  },

  // settings & preferences
  getSettings() {
    try {
      const raw = localStorage.getItem(getKey('settings'));
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          appearance: { ...seed.settings.appearance, ...(parsed.appearance || {}) },
          notifications: { ...seed.settings.notifications, ...(parsed.notifications || {}) },
          security: { ...seed.settings.security, ...(parsed.security || {}) },
          database: { ...seed.settings.database, ...(parsed.database || {}) },
          advanced: { ...seed.settings.advanced, ...(parsed.advanced || {}) },
        };
      }
    } catch (_) {}
    const s = JSON.parse(JSON.stringify(seed.settings));
    localStorage.setItem(getKey('settings'), JSON.stringify(s));
    return s;
  },
  saveSettings(newSettings) {
    const current = this.getSettings();
    const merged = {
      appearance: { ...current.appearance, ...(newSettings.appearance || {}) },
      notifications: { ...current.notifications, ...(newSettings.notifications || {}) },
      security: { ...current.security, ...(newSettings.security || {}) },
      database: { ...current.database, ...(newSettings.database || {}) },
      advanced: { ...current.advanced, ...(newSettings.advanced || {}) },
    };
    localStorage.setItem(getKey('settings'), JSON.stringify(merged));
    return merged;
  },

  // database management & backups
  getDatabaseStats() {
    let totalBytes = 0;
    const collections = [
      { name: 'incomes', label: 'Income Records', color: '#00a65a' },
      { name: 'expenses', label: 'Expense Records', color: '#dd4b39' },
      { name: 'feeGroups', label: 'Fee Groups', color: '#3c8dbc' },
      { name: 'feeTypes', label: 'Fee Types', color: '#f39c12' },
      { name: 'incomeHeads', label: 'Income Heads', color: '#605ca8' },
      { name: 'expenseHeads', label: 'Expense Heads', color: '#00c0ef' },
      { name: 'students', label: 'Student Directory', color: '#39cccc' },
      { name: 'calendarEvents', label: 'Calendar Events', color: '#d81b60' },
      { name: 'leads', label: 'Admission Leads', color: '#ff851b' },
      { name: 'loans', label: 'Staff Loans', color: '#795548' },
      { name: 'leaves', label: 'Leave Requests', color: '#001f3f' },
      { name: 'profile', label: 'Staff Profile', color: '#607d8b' },
      { name: 'settings', label: 'System Settings', color: '#546e7a' },
    ];
    const details = collections.map((col) => {
      const key = getKey(col.name);
      const val = localStorage.getItem(key) || '';
      const bytes = new Blob([val]).size;
      totalBytes += bytes;
      let count = 0;
      try {
        const parsed = JSON.parse(val);
        count = Array.isArray(parsed) ? parsed.length : (parsed ? 1 : 0);
      } catch (_) {}
      return {
        ...col,
        key,
        count,
        bytes,
        sizeKb: (bytes / 1024).toFixed(2),
      };
    });
    return {
      totalBytes,
      totalKb: (totalBytes / 1024).toFixed(2),
      details,
    };
  },
  exportAllData() {
    const backup = {
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      institution: 'Oxford International Public School',
      data: {},
    };
    const allKeys = [
      'incomes', 'expenses', 'feeGroups', 'feeTypes', 'incomeHeads', 'expenseHeads',
      'students', 'calendarEvents', 'leads', 'loans', 'leaves', 'profile', 'settings'
    ];
    allKeys.forEach((k) => {
      const raw = localStorage.getItem(getKey(k));
      if (raw) {
        try {
          backup.data[k] = JSON.parse(raw);
        } catch (_) {}
      }
    });
    return backup;
  },
  importAllData(jsonObj) {
    if (!jsonObj || typeof jsonObj !== 'object') {
      throw new Error('Invalid JSON format');
    }
    const dataObj = jsonObj.data || jsonObj;
    let importedKeys = 0;
    Object.keys(dataObj).forEach((k) => {
      if (dataObj[k] !== undefined) {
        localStorage.setItem(getKey(k), JSON.stringify(dataObj[k]));
        importedKeys++;
      }
    });
    return importedKeys;
  },
  clearCollection(collection) {
    if (seed[collection]) {
      write(collection, JSON.parse(JSON.stringify(seed[collection])));
    } else {
      localStorage.removeItem(getKey(collection));
    }
  },

  // notifications management
  getNotifications() {
    return read('notificationsList');
  },
  markNotificationRead(id) {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    write('notificationsList', updated);
    return updated;
  },
  markNotificationUnread(id) {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: false } : n));
    write('notificationsList', updated);
    return updated;
  },
  markAllNotificationsRead() {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    write('notificationsList', updated);
    return updated;
  },
  deleteNotification(id) {
    const list = this.getNotifications();
    const updated = list.filter((n) => n.id !== id);
    write('notificationsList', updated);
    return updated;
  },
  clearReadNotifications() {
    const list = this.getNotifications();
    const updated = list.filter((n) => !n.read);
    write('notificationsList', updated);
    return updated;
  },

  // reset all data (useful for debugging)
  reset() {
    Object.keys(seed).forEach((k) => localStorage.removeItem(getKey(k)));
  },
};

export default localDb;
