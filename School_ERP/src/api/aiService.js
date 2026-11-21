import axiosInstance from './axios';

// Detect subject category based on subject name and chapter topic
const detectSubjectCategory = (subject = '', topic = '') => {
  const text = `${subject} ${topic}`.toLowerCase();
  
  if (
    text.includes('comput') || text.includes('coding') || text.includes(' it') || 
    text.includes('information tech') || text.includes('software') || text.includes('hardware') || 
    text.includes('cyber') || text.includes('python') || text.includes(' ai') || 
    text.includes('internet') || text.includes('program') || text.includes('cpu') || 
    text.includes('keyboard') || text.includes('data structure') || text.includes('mouse') ||
    text.includes('operating system') || text.includes('windows') || text.includes('paint')
  ) {
    return 'Computer Science';
  }
  if (
    text.includes('math') || text.includes('arith') || text.includes('algeb') || 
    text.includes('geom') || text.includes('trig') || text.includes('calculus') || 
    text.includes('number') || text.includes('fraction') || text.includes('equation') || 
    text.includes('mensurat') || text.includes('tables')
  ) {
    return 'Mathematics';
  }
  if (
    text.includes('eng') || text.includes('grammar') || text.includes('prose') || 
    text.includes('poetry') || text.includes('comprehen') || text.includes('vocabulary') || 
    text.includes('noun') || text.includes('tense') || text.includes('phonics')
  ) {
    return 'English';
  }
  if (
    text.includes('hindi') || text.includes('vyakaran') || text.includes('sahitya') || 
    text.includes('varnamala') || text.includes('kavita')
  ) {
    return 'Hindi';
  }
  if (
    text.includes('social') || text.includes('sst') || text.includes('history') || 
    text.includes('civic') || text.includes('geograph') || text.includes('polity') || 
    text.includes('map') || text.includes('earth') || text.includes('heritage')
  ) {
    return 'Social Studies';
  }
  return 'Science';
};

const fallbackCurriculumPaper = (params = {}) => {
  const rawSubject = params.subject || 'Computer Science';
  const className = params.class || params.className || 'Class II';
  const topic = params.topic || 'Basic Computer Concepts';
  const examTitle = params.examTitle || 'Term Assessment Examination';
  const difficulty = params.difficulty || 'Medium';
  const numMCQ = Number(params.numMCQ) || 5;
  const numShort = Number(params.numShort) || 4;
  const numLong = Number(params.numLong) || 2;

  const category = detectSubjectCategory(rawSubject, topic);

  const curriculumBanks = {
    'Computer Science': {
      mcqs: [
        { q: "Which part of the computer is known as its 'Brain'?", opts: ["A) Monitor", "B) CPU (Central Processing Unit)", "C) Mouse", "D) Keyboard"], ans: "B", exp: "CPU processes all instructions and controls computer operations." },
        { q: "Which of the following is an INPUT device used to enter text?", opts: ["A) Speaker", "B) Monitor", "C) Keyboard", "D) Printer"], ans: "C", exp: "Keyboard allows users to type letters, numbers, and commands into the computer." },
        { q: "Which part of the computer looks like a TV screen and displays output?", opts: ["A) CPU", "B) Monitor", "C) Mouse", "D) UPS"], ans: "B", exp: "Monitor (Visual Display Unit) displays images, text, and videos." },
        { q: "The physical parts of a computer that you can see and touch are called:", opts: ["A) Software", "B) Hardware", "C) Operating System", "D) Internet"], ans: "B", exp: "Hardware refers to tangible physical electronic components." },
        { q: "Which device is used to point, click, and select items on the screen?", opts: ["A) Mouse", "B) Printer", "C) CPU", "D) Hard Disk"], ans: "A", exp: "A computer mouse is a handheld pointing input device." },
        { q: "Which device keeps the computer working for some time when electricity goes off?", opts: ["A) CPU", "B) CD-ROM", "C) UPS (Uninterruptible Power Supply)", "D) Speaker"], ans: "C", exp: "UPS provides battery backup during unexpected power cuts." },
        { q: "Which device is used to print your work and drawings on paper?", opts: ["A) Scanner", "B) Printer", "C) Microphone", "D) Projector"], ans: "B", exp: "Printer produces hard copy printouts on paper." },
        { q: "Which key on the keyboard is the longest key and is used to give space?", opts: ["A) Enter key", "B) Spacebar", "C) Shift key", "D) Backspace key"], ans: "B", exp: "Spacebar is the longest key located at the bottom of the keyboard." },
        { q: "Which key is pressed to move the cursor to the next new line?", opts: ["A) Caps Lock", "B) Escape key", "C) Enter key", "D) Ctrl key"], ans: "C", exp: "Enter key confirms actions or starts a new paragraph." },
        { q: "Which tool in MS Paint is used to fill color in a closed drawing?", opts: ["A) Pencil tool", "B) Eraser tool", "C) Fill with Color tool", "D) Magnifier tool"], ans: "C", exp: "Fill with Color (paint bucket) colors inside enclosed borders." },
        { q: "A small arrow that moves on the screen when you move the mouse is called:", opts: ["A) Icon", "B) Pointer / Cursor", "C) Wallpaper", "D) Taskbar"], ans: "B", exp: "Mouse pointer tracks coordinates on the graphical display." },
        { q: "A small portable storage device that can be attached to a USB port is:", opts: ["A) Monitor", "B) Pen Drive / Flash Drive", "C) Mouse", "D) RAM"], ans: "B", exp: "Pen drive is lightweight portable flash storage." },
        { q: "A set of instructions or programs that tells a computer what to do is:", opts: ["A) Hardware", "B) Software", "C) Keyboard", "D) Wire"], ans: "B", exp: "Software represents intangible computer programs and applications." },
        { q: "Which key is used to erase a typed letter to the left of the cursor?", opts: ["A) Delete key", "B) Backspace key", "C) Shift key", "D) Spacebar"], ans: "B", exp: "Backspace removes characters on the immediate left." },
        { q: "Which of the following is an example of an Operating System?", opts: ["A) Microsoft Windows", "B) MS Paint", "C) Google Chrome", "D) Calculator"], ans: "A", exp: "Windows is a system operating software managing hardware and applications." }
      ],
      short: [
        { q: `What is a computer? Write any two essential characteristics of a computer.`, marks: 3, ans: "A computer is an electronic machine that accepts input data, processes it according to instructions, and produces meaningful output. Two key features: 1. High speed. 2. 100% accuracy.", markingScheme: "1.5 marks for definition, 1.5 marks for two features." },
        { q: `Differentiate between Input Devices and Output Devices with two examples of each in topic "${topic}".`, marks: 3, ans: "Input devices feed data into the computer (e.g. Keyboard, Mouse). Output devices display or print results generated by the computer (e.g. Monitor, Printer).", markingScheme: "1.5 marks for definition difference, 1.5 marks for examples." },
        { q: `Explain the main functions of a CPU. Name its three major internal units.`, marks: 3, ans: "CPU (Central Processing Unit) performs all calculations and controls other components. Its three units are: 1. ALU (Arithmetic Logic Unit). 2. CU (Control Unit). 3. MU (Memory Unit).", markingScheme: "1.5 marks for role, 1.5 marks for 3 units." },
        { q: `What is Computer Hardware? Name three hardware components found in a school computer lab.`, marks: 3, ans: "Hardware refers to physical parts of a computer system that can be touched and seen. Examples: Monitor, System Unit (CPU box), Keyboard, Mouse, and Printer.", markingScheme: "1.5 marks for definition, 1.5 marks for 3 examples." },
        { q: `What is Computer Software? Differentiate between System Software and Application Software.`, marks: 3, ans: "Software is a collection of programs and instructions. System Software manages computer hardware (e.g. Windows OS). Application Software performs specific user tasks (e.g. MS Paint, Calculator).", markingScheme: "1 mark for software definition, 2 marks for distinction." },
        { q: `Describe the role of the Mouse. What happens when you perform Left Click, Right Click, and Double Click?`, marks: 3, ans: "Left Click selects an item. Double Click opens a file or program. Right Click displays a shortcut context menu with options.", markingScheme: "1 mark each for correct explanation of all 3 click types." },
        { q: `What is a Keyboard? Explain the functions of the Spacebar, Enter key, and Backspace key.`, marks: 3, ans: "A keyboard is an input device with alphanumeric keys. Spacebar: inserts blank spaces. Enter key: moves to the next line. Backspace: deletes characters to the left.", markingScheme: "1 mark for keyboard role, 2 marks for key functions." },
        { q: `What is a Monitor? Name the two primary types of monitors used with desktop computers.`, marks: 3, ans: "A monitor is an output device that displays visual text and graphics. Two main types: 1. CRT (Cathode Ray Tube) monitors. 2. LCD/LED flat-panel monitors.", markingScheme: "1.5 marks for monitor definition, 1.5 marks for types." },
        { q: `What is a UPS? Explain why a UPS is important for a desktop computer.`, marks: 3, ans: "UPS stands for Uninterruptible Power Supply. It supplies battery backup during sudden power cuts, preventing unsaved work loss and hardware damage.", markingScheme: "1.5 marks for full form & meaning, 1.5 marks for importance." },
        { q: `What are Storage Devices? Name any three secondary storage media used to save digital files.`, marks: 3, ans: "Storage devices preserve programs and files permanently. Examples: 1. Hard Disk Drive (HDD). 2. Pen Drive (USB Flash Drive). 3. Memory Card / SD Card.", markingScheme: "1.5 marks for concept, 1.5 marks for 3 examples." }
      ],
      long: [
        { q: `Explain the Input - Process - Output (IPO) cycle of a computer with a neat labeled block diagram and a real-life example for "${topic}".`, marks: 5, ans: "1. Input: Entering data (e.g. typing 5 + 3 on keyboard). 2. Process: CPU calculates the sum (5 + 3 = 8). 3. Output: Result '8' is displayed on the monitor. Real life example: Making mango shake (Mangoes & milk = Input, Grinding in mixer = Process, Mango shake = Output).", markingScheme: "1.5 marks for block diagram, 2 marks for IPO explanation, 1.5 marks for real-world example." },
        { q: `Describe the four primary functional units of a computer system in detail: Input Unit, CPU, Output Unit, and Storage Unit.`, marks: 5, ans: "1. Input Unit: Captures raw data (Keyboard/Mouse). 2. Processing Unit (CPU): Executes logic and arithmetic. 3. Output Unit: Presents processed results (Monitor/Printer). 4. Storage Unit: Retains data temporarily (RAM) and permanently (Hard Disk).", markingScheme: "1.25 marks for each of the 4 units with clear function and device examples." },
        { q: `Differentiate between Computer Hardware and Computer Software in detail. Give four examples of each and explain their mutual dependency.`, marks: 5, ans: "Hardware is physical machinery (Keyboard, CPU, Monitor, RAM). Software is a collection of digital instructions (Windows, MS Paint, Word). Dependency: Hardware cannot function without software instructions; software requires hardware physical execution.", markingScheme: "2 marks for tabular difference, 2 marks for 4 examples each, 1 mark for dependency." },
        { q: `Discuss the wide-ranging applications of computers in modern society across: (a) Schools & Education, (b) Hospitals, (c) Banks, (d) Railways/Airports, and (e) Entertainment.`, marks: 5, ans: "Schools: Smart classrooms and report cards. Hospitals: Medical diagnostics and patient records. Banks: ATM transactions and online banking. Transport: Reservation ticketing. Entertainment: Animated games and digital music.", markingScheme: "1 mark each for all 5 sectors." },
        { q: `What are Computer Storage Devices? Explain the differences between Primary Memory (RAM & ROM) and Secondary Memory (Hard Disk & Pen Drive).`, marks: 5, ans: "Storage devices store digital data. Primary memory is fast and directly accessed by CPU; RAM is volatile (lost on power off) while ROM is non-volatile. Secondary memory is permanent, large capacity storage like Hard Disks and Pen Drives.", markingScheme: "1.5 marks for storage definition, 2 marks for RAM vs ROM, 1.5 marks for secondary storage." }
      ]
    },
    'Mathematics': {
      mcqs: [
        { q: "What is the value of 15 + 27?", opts: ["A) 42", "B) 32", "C) 52", "D) 40"], ans: "A", exp: "15 + 27 = 42." },
        { q: "Which geometric shape has 3 sides and 3 corners?", opts: ["A) Square", "B) Circle", "C) Triangle", "D) Rectangle"], ans: "C", exp: "A triangle has 3 straight edges and 3 vertices." },
        { q: "What is the place value of 7 in the number 75?", opts: ["A) 7", "B) 70", "C) 5", "D) 700"], ans: "B", exp: "7 is in the tens place, so 7 × 10 = 70." },
        { q: "Which number comes just before 100?", opts: ["A) 90", "B) 98", "C) 99", "D) 101"], ans: "C", exp: "Predecessor of 100 is 99." },
        { q: "If you have 4 apples and get 3 more, how many apples do you have in total?", opts: ["A) 6", "B) 7", "C) 8", "D) 9"], ans: "B", exp: "4 + 3 = 7." }
      ],
      short: [
        { q: `Write the number names for: (a) 48 (b) 75 (c) 92 in words.`, marks: 3, ans: "(a) Forty-Eight (b) Seventy-Five (c) Ninety-Two.", markingScheme: "1 mark each for correct spelling." },
        { q: `Arrange the following numbers in ascending order: 34, 12, 89, 56, 21.`, marks: 3, ans: "Ascending order: 12, 21, 34, 56, 89.", markingScheme: "1 mark for lowest identification, 2 marks for full sequence." }
      ],
      long: [
        { q: `Rohan bought a notebook for ₹35 and a geometry box for ₹45. He gave a ₹100 note to the shopkeeper. How much change will he receive?`, marks: 5, ans: "Total spent = ₹80. Change = ₹100 - ₹80 = ₹20.", markingScheme: "2 marks for sum, 3 marks for change." }
      ]
    },
    'Science': {
      mcqs: [
        { q: "Which part of a plant grows under the soil to absorb water and minerals?", opts: ["A) Stem", "B) Leaf", "C) Root", "D) Flower"], ans: "C", exp: "Roots anchor the plant into the ground and absorb moisture and nutrients." },
        { q: "Which animal is commonly known as the 'Ship of the Desert'?", opts: ["A) Horse", "B) Camel", "C) Elephant", "D) Lion"], ans: "B", exp: "Camels have wide padded feet and can survive long durations without water in arid climates." }
      ],
      short: [
        { q: `Name the five sense organs and mention the primary function of each.`, marks: 3, ans: "1. Eyes: Vision. 2. Ears: Hearing. 3. Nose: Smell. 4. Tongue: Taste. 5. Skin: Touch.", markingScheme: "0.5 marks per organ with function." }
      ],
      long: [
        { q: `Describe the main parts of a flowering plant with a neat labeled diagram.`, marks: 5, ans: "Roots: Anchor and absorb water. Stem: Transports water/nutrients. Leaves: Perform photosynthesis. Flower: Reproductive organ.", markingScheme: "2 marks for diagram, 3 marks for function." }
      ]
    }
  };

  const selectedBank = curriculumBanks[category] || curriculumBanks['Computer Science'];

  const generateProceduralMCQ = (idx, seed) => {
    if (category === 'Computer Science') {
      const concepts = [
        { q: `In computer applications for "${topic}", which keyboard shortcut is used to Save a file?`, opts: ["A) Ctrl + S", "B) Ctrl + P", "C) Ctrl + Z", "D) Alt + F4"], ans: "A", exp: "Ctrl + S saves the current active document." },
        { q: `Which of the following is true about computer accuracy in "${topic}"?`, opts: ["A) Calculates without mistakes", "B) Frequently gets tired", "C) Requires sleep", "D) Has human emotions"], ans: "A", exp: "Computers execute instructions with 100% precision." },
        { q: `What is the primary role of an Antivirus program on school workstations?`, opts: ["A) Delete pictures", "B) Protect files from malicious viruses", "C) Play videos", "D) Draw diagrams"], ans: "B", exp: "Antivirus protects system software from malware." },
        { q: `Which peripheral connects computers together in a local school lab network?`, opts: ["A) Network Switch / Router", "B) Mouse Pad", "C) Scanner", "D) Microphone"], ans: "A", exp: "Network switches and routers route digital packets." }
      ];
      return concepts[seed % concepts.length];
    } else {
      const a = (seed * 6) + 10;
      const b = (seed * 4) + 5;
      return {
        q: `Evaluate for "${topic}": What is ${a} + ${b}?`,
        opts: [`A) ${a + b}`, `B) ${a + b + 2}`, `C) ${a + b - 3}`, `D) ${a + b + 10}`],
        ans: "A",
        exp: `${a} + ${b} = ${a + b}.`
      };
    }
  };

  const generateProceduralShort = (idx, seed) => {
    if (category === 'Computer Science') {
      const pool = [
        { q: `Explain the importance of organizing files into separate folders on a computer for topic "${topic}".`, ans: "Folders categorize related documents cleanly, preventing clutter and enabling fast file search.", scheme: "1.5 marks for definition, 1.5 marks for benefits." },
        { q: `What is the difference between a Desktop computer and a Laptop computer?`, ans: "Desktops are stationary units with separate components. Laptops are compact, battery-powered portable machines.", scheme: "1.5 marks per difference." },
        { q: `List three common input devices used in modern computer labs.`, ans: "1. Keyboard. 2. Optical Mouse. 3. Scanner / Webcam.", scheme: "1 mark per input device." },
        { q: `Why should we never turn off a computer by directly pulling the electrical wall plug?`, ans: "Abrupt power disconnection can corrupt operating system files and damage storage disk heads.", scheme: "1.5 marks for OS corruption risk, 1.5 marks for hardware risk." }
      ];
      return pool[seed % pool.length];
    } else {
      return {
        q: `Explain two essential principles of "${topic}" with real-world examples.`,
        ans: "Structured analysis and foundational conceptual understanding are key.",
        scheme: "1.5 marks per principle."
      };
    }
  };

  const generateProceduralLong = (idx, seed) => {
    if (category === 'Computer Science') {
      const pool = [
        { q: `Discuss the role of Computers in modern society. Explain four distinct fields where computers have revolutionized work for "${topic}".`, ans: "1. Education: Smart classrooms. 2. Hospitals: Diagnostic MRI. 3. Banks: ATM networks. 4. Transport: Reservation ticketing.", scheme: "1.25 marks per application field." },
        { q: `Explain the complete step-by-step workflow of how a computer processes an instruction from Input Unit to Storage.`, ans: "1. Input device captures raw data. 2. Data stored in RAM. 3. CPU executes arithmetic/logic. 4. Output displayed on monitor. 5. Persisted on disk.", scheme: "1 mark per process stage." },
        { q: `What are Cyber Safety guidelines? Describe five essential security habits every student must observe.`, ans: "1. Keep passwords confidential. 2. Never open unknown links. 3. Run Antivirus. 4. Avoid sharing personal data. 5. Report cyber threats.", scheme: "1 mark per safety rule." }
      ];
      return pool[seed % pool.length];
    } else {
      return {
        q: `Provide a comprehensive structured analysis of "${topic}" with step-by-step illustrations and conclusions.`,
        ans: "Detailed explanation covering core axioms, step-by-step applications, and practical insights.",
        scheme: "2.5 marks for foundational theory, 2.5 marks for applied analysis."
      };
    }
  };

  const buildExactList = (baseList, count, generatorFn) => {
    const list = [];
    for (let i = 0; i < count; i++) {
      if (i < baseList.length) {
        list.push({ ...baseList[i] });
      } else {
        list.push(generatorFn(i + 1, i));
      }
    }
    return list;
  };

  const rawMCQs = buildExactList(selectedBank.mcqs || [], numMCQ, generateProceduralMCQ);
  const rawShorts = buildExactList(selectedBank.short || [], numShort, generateProceduralShort);
  const rawLongs = buildExactList(selectedBank.long || [], numLong, generateProceduralLong);

  let questionNumber = 1;
  const sectionA_MCQ = rawMCQs.map((m) => ({
    id: questionNumber++,
    question: m.q,
    options: m.opts,
    answer: m.ans,
    marks: 1,
    explanation: m.exp
  }));

  const sectionB_Short = rawShorts.map((s) => ({
    id: questionNumber++,
    question: s.q,
    marks: s.marks || 3,
    answer: s.ans,
    markingScheme: s.markingScheme || s.scheme
  }));

  const sectionC_Long = rawLongs.map((l) => ({
    id: questionNumber++,
    question: l.q,
    marks: l.marks || 5,
    answer: l.ans,
    markingScheme: l.markingScheme || l.scheme
  }));

  const calculatedTotalMarks = (sectionA_MCQ.length * 1) + (sectionB_Short.length * 3) + (sectionC_Long.length * 5);

  return {
    examTitle: examTitle || 'Term Assessment Examination',
    className: className || 'Class II',
    subject: rawSubject,
    topic: topic || 'Basic Concepts',
    totalMarks: calculatedTotalMarks,
    timeAllowed: '2 Hours',
    difficulty: difficulty || 'Medium',
    generalInstructions: [
      "1. All questions are compulsory across Sections A, B, and C.",
      `2. Section A contains ${sectionA_MCQ.length} objective questions (1 Mark each).`,
      `3. Section B contains ${sectionB_Short.length} short answer questions (3 Marks each).`,
      `4. Section C contains ${sectionC_Long.length} descriptive questions (5 Marks each).`,
      "5. Write your name, roll number, and date clearly on the top answer sheet."
    ],
    sectionA_MCQ,
    sectionB_Short,
    sectionC_Long
  };
};

export const aiService = {
  generateExamPaper: async (params) => {
    try {
      const response = await axiosInstance.post('/ai/generate-exam-paper', params);
      if (response.data && response.data.success && response.data.data) {
        const d = response.data.data;
        const hasMCQs = Array.isArray(d.sectionA_MCQ) && d.sectionA_MCQ.length >= (Number(params.numMCQ) || 1);
        const hasShort = Array.isArray(d.sectionB_Short) && d.sectionB_Short.length >= (Number(params.numShort) || 1);
        if (hasMCQs && hasShort) {
          return response.data;
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, using curriculum engine:', err?.message);
    }
    const paper = fallbackCurriculumPaper(params);
    return {
      success: true,
      source: 'curriculum-engine',
      data: paper
    };
  },

  generateStudentRemarks: async (params) => {
    try {
      const response = await axiosInstance.post('/ai/generate-remarks', params);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend API unavailable, using remarks fallback:', err?.message);
    }
    const studentName = params.studentName || 'Student';
    const marks = Number(params.marks) || 0;
    const maxMarks = Number(params.maxMarks) || 100;
    const subject = params.subject || 'Academics';
    const pct = (marks / maxMarks) * 100;

    let remark = '';
    if (pct >= 85) {
      remark = `${studentName} has demonstrated outstanding mastery and deep conceptual clarity in ${subject}. Excellent analytical focus!`;
    } else if (pct >= 70) {
      remark = `${studentName} shows very commendable effort and strong comprehension in ${subject}. With regular revision, top honors are well within reach.`;
    } else if (pct >= 50) {
      remark = `${studentName} possesses a solid foundational grasp of ${subject}. Continued daily practice will significantly boost speed and accuracy.`;
    } else {
      remark = `${studentName} requires additional academic reinforcement in ${subject}. Regular practice and structured doubt-clearing sessions are recommended.`;
    }
    return {
      success: true,
      data: { remark }
    };
  },

  generateLessonPlan: async (params) => {
    try {
      const response = await axiosInstance.post('/ai/generate-lesson-plan', params);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend API unavailable, using lesson plan fallback:', err?.message);
    }
    const topic = params.topic || 'Core Chapter Concepts';
    return {
      success: true,
      data: {
        topic,
        learningObjectives: [
          `Understand fundamental axioms and real-world relevance of ${topic}.`,
          `Analyze and solve step-by-step illustrations collaboratively.`,
          `Demonstrate independent mastery through practice problems.`
        ],
        materialsRequired: ['NCERT / Prescribed Textbook', 'Interactive Smartboard', 'Formative Practice Sheets'],
        assessmentAndHomework: `Complete textbook review exercises 1 to 6 and summarize key theorems in class notebook.`
      }
    };
  }
};

export default aiService;
