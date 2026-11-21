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
  // Default to Science / Environmental Studies
  return 'Science';
};

// Built-in Comprehensive Academic Curriculum Engine
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

  // Comprehensive Subject Question Banks
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
        { q: "Which of the following is an example of an Operating System?", opts: ["A) Microsoft Windows", "B) MS Paint", "C) Google Chrome", "D) Calculator"], ans: "A", exp: "Windows is a system operating software managing hardware and applications." },
        { q: "Which keyboard key is pressed to type letters in capital letters continuously?", opts: ["A) Alt key", "B) Caps Lock key", "C) Tab key", "D) Esc key"], ans: "B", exp: "Caps Lock toggles uppercase alphabet typing mode." },
        { q: "A computer network that connects computers across the entire world is called:", opts: ["A) LAN", "B) Internet", "C) Bluetooth", "D) USB"], ans: "B", exp: "The Internet is the global network of interconnected computers." },
        { q: "Which device is used to record your voice into the computer?", opts: ["A) Speaker", "B) Microphone", "C) Monitor", "D) Mouse"], ans: "B", exp: "Microphone captures acoustic audio and converts it to digital signals." },
        { q: "The small picture icons shown on the desktop screen are called:", opts: ["A) Wallpaper", "B) Desktop Icons", "C) Taskbar", "D) Screensaver"], ans: "B", exp: "Icons represent files, folders, or application shortcuts." },
        { q: "What does PC stand for in computer terminology?", opts: ["A) Private Computer", "B) Personal Computer", "C) Public Computer", "D) Powerful CPU"], ans: "B", exp: "PC refers to microcomputers designed for individual use." }
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
        { q: `What are Storage Devices? Name any three secondary storage media used to save digital files.`, marks: 3, ans: "Storage devices preserve programs and files permanently. Examples: 1. Hard Disk Drive (HDD). 2. Pen Drive (USB Flash Drive). 3. Memory Card / SD Card.", markingScheme: "1.5 marks for concept, 1.5 marks for 3 examples." },
        { q: `State any three important safety and hygiene rules to follow in a school computer laboratory.`, marks: 3, ans: "1. Do not touch open electrical wires or plugs. 2. Keep the computer desk clean and do not eat or drink near machines. 3. Press keys gently and shutdown properly.", markingScheme: "1 mark per safety rule." },
        { q: `What is MS Paint? Name four popular tools available in MS Paint for creating drawings.`, marks: 3, ans: "MS Paint is a graphics drawing software. Four tools: 1. Pencil Tool. 2. Fill with Color (Bucket) Tool. 3. Eraser Tool. 4. Shapes Tool (Line, Rectangle, Oval).", markingScheme: "1 mark for MS Paint definition, 2 marks for 4 tools." },
        { q: `What is an Operating System? Why is it considered the manager of a computer system?`, marks: 3, ans: "An Operating System (OS) is master software that acts as an interface between the user and hardware. It manages memory, processes, and connected devices.", markingScheme: "1.5 marks for definition, 1.5 marks for role." },
        { q: `What is the Internet? Write two ways students can use the internet for academic learning.`, marks: 3, ans: "The Internet is a global network linking computers worldwide. Educational uses: 1. Researching school projects and educational encyclopedias. 2. Attending online classes and tutorials.", markingScheme: "1.5 marks for internet definition, 1.5 marks for 2 uses." },
        { q: `What is a File and a Folder? How do folders help in keeping our computer organized?`, marks: 3, ans: "A File is an item that contains data (text, drawing, or audio). A Folder is a digital container where related files are grouped and organized neatly.", markingScheme: "1.5 marks for file/folder definitions, 1.5 marks for organization role." },
        { q: `Differentiate between Desktop Computers and Laptop Computers with two points of comparison.`, marks: 3, ans: "1. Desktop computers are fixed on a table and require continuous power. 2. Laptops are portable, lightweight, and run on built-in rechargeable batteries.", markingScheme: "1.5 marks per comparison point." }
      ],
      long: [
        { q: `Explain the Input - Process - Output (IPO) cycle of a computer with a neat labeled block diagram and a real-life example for "${topic}".`, marks: 5, ans: "1. Input: Entering data (e.g. typing 5 + 3 on keyboard). 2. Process: CPU calculates the sum (5 + 3 = 8). 3. Output: Result '8' is displayed on the monitor. Real life example: Making mango shake (Mangoes & milk = Input, Grinding in mixer = Process, Mango shake = Output).", markingScheme: "1.5 marks for block diagram, 2 marks for IPO explanation, 1.5 marks for real-world example." },
        { q: `Describe the four primary functional units of a computer system in detail: Input Unit, CPU, Output Unit, and Storage Unit.`, marks: 5, ans: "1. Input Unit: Captures raw data (Keyboard/Mouse). 2. Processing Unit (CPU): Executes logic and arithmetic. 3. Output Unit: Presents processed results (Monitor/Printer). 4. Storage Unit: Retains data temporarily (RAM) and permanently (Hard Disk).", markingScheme: "1.25 marks for each of the 4 units with clear function and device examples." },
        { q: `Differentiate between Computer Hardware and Computer Software in detail. Give four examples of each and explain their mutual dependency.`, marks: 5, ans: "Hardware is physical machinery (Keyboard, CPU, Monitor, RAM). Software is a collection of digital instructions (Windows, MS Paint, Word). Dependency: Hardware cannot function without software instructions; software requires hardware physical execution.", markingScheme: "2 marks for tabular difference, 2 marks for 4 examples each, 1 mark for dependency." },
        { q: `Discuss the wide-ranging applications of computers in modern society across: (a) Schools & Education, (b) Hospitals, (c) Banks, (d) Railways/Airports, and (e) Entertainment.`, marks: 5, ans: "Schools: Smart classrooms and report cards. Hospitals: Medical diagnostics and patient records. Banks: ATM transactions and online banking. Transport: Reservation ticketing. Entertainment: Animated games and digital music.", markingScheme: "1 mark each for all 5 sectors." },
        { q: `What are Computer Storage Devices? Explain the differences between Primary Memory (RAM & ROM) and Secondary Memory (Hard Disk & Pen Drive).`, marks: 5, ans: "Storage devices store digital data. Primary memory is fast and directly accessed by CPU; RAM is volatile (lost on power off) while ROM is non-volatile. Secondary memory is permanent, large capacity storage like Hard Disks and Pen Drives.", markingScheme: "1.5 marks for storage definition, 2 marks for RAM vs ROM, 1.5 marks for secondary storage." },
        { q: `Describe the step-by-step procedure to: (a) Create a new folder on the desktop, (b) Rename the folder, (c) Save an MS Paint drawing inside it, and (d) Safely shutdown the computer.`, marks: 5, ans: "(a) Right-click desktop > New > Folder. (b) Type folder name and press Enter. (c) In MS Paint click File > Save As > Select folder > Click Save. (d) Click Start button > Click Power > Click Shut down.", markingScheme: "1.25 marks for each procedural step." },
        { q: `What is an Operating System? Explain its four major responsibilities: Processor management, Memory management, Device management, and File security.`, marks: 5, ans: "An Operating System manages computer hardware resources. 1. Processor: schedules task execution. 2. Memory: allocates RAM to running programs. 3. Device: communicates with printers and keyboards. 4. Security: manages passwords and user accounts.", markingScheme: "1 mark for OS concept, 1 mark each for the 4 responsibilities." },
        { q: `What is Computer Networking and the Internet? Explain three advantages and two safety precautions while using the internet for research.`, marks: 5, ans: "A network connects computers to share data. Advantages: 1. Instant global communication (Email). 2. Endless educational resources. 3. Online learning. Safety rules: 1. Never share passwords. 2. Never talk to strangers online.", markingScheme: "1.5 marks for definition, 2 marks for advantages, 1.5 marks for safety guidelines." },
        { q: `Explain the five generations of computers highlighting the key technological transition in each generation from Vacuum Tubes to Artificial Intelligence.`, marks: 5, ans: "1st Gen: Vacuum Tubes (1940-56). 2nd Gen: Transistors (1956-63). 3rd Gen: Integrated Circuits - ICs (1964-71). 4th Gen: Microprocessors - VLSI (1971-Present). 5th Gen: Ultra-Large Scale Integration & AI.", markingScheme: "1 mark for each generation with correct era technology." },
        { q: `Explain what a Computer Virus is, how it spreads from one machine to another, and list three precautions to protect school computers.`, marks: 5, ans: "A computer virus is a malicious software program designed to corrupt files and slow down machines. Spreads via infected pen drives or untrusted downloads. Precautions: 1. Install Antivirus software. 2. Scan pen drives before opening. 3. Avoid suspicious links.", markingScheme: "1.5 marks for virus definition, 1.5 marks for transmission modes, 2 marks for 3 precautions." },
        { q: `Describe the tools and features of MS Paint: Pencil, Eraser, Fill with Color, Brushes, Text Tool, and Shape Palette.`, marks: 5, ans: "Pencil: Freehand drawing. Eraser: Rubs out mistakes. Fill with Color: Colors enclosed areas. Brushes: Artistic strokes with varied textures. Text Tool: Inserts words. Shapes: Pre-drawn geometric forms.", markingScheme: "1 mark for overall interface description, 4 marks for specific tools." },
        { q: `Compare human beings and computers on the basis of: (a) Speed, (b) Accuracy, (c) Memory / Storage, (d) Tiredness / Fatigue, and (e) Decision making / Feelings.`, marks: 5, ans: "Speed: Computer is much faster. Accuracy: Computer makes zero calculation mistakes. Memory: Computer never forgets saved data. Fatigue: Computer never gets tired. Decisions: Humans have feelings and wisdom; computers require instructions.", markingScheme: "1 mark per comparison parameter." }
      ]
    },
    'Mathematics': {
      mcqs: [
        { q: "What is the value of 15 + 27?", opts: ["A) 42", "B) 32", "C) 52", "D) 40"], ans: "A", exp: "15 + 27 = 42." },
        { q: "Which geometric shape has 3 sides and 3 corners?", opts: ["A) Square", "B) Circle", "C) Triangle", "D) Rectangle"], ans: "C", exp: "A triangle has 3 straight edges and 3 vertices." },
        { q: "What is the place value of 7 in the number 75?", opts: ["A) 7", "B) 70", "C) 5", "D) 700"], ans: "B", exp: "7 is in the tens place, so 7 × 10 = 70." },
        { q: "Which number comes just before 100?", opts: ["A) 90", "B) 98", "C) 99", "D) 101"], ans: "C", exp: "Predecessor of 100 is 99." },
        { q: "If you have 4 apples and get 3 more, how many apples do you have in total?", opts: ["A) 6", "B) 7", "C) 8", "D) 9"], ans: "B", exp: "4 + 3 = 7." },
        { q: "What is 10 multiplied by 5?", opts: ["A) 15", "B) 50", "C) 55", "D) 500"], ans: "B", exp: "10 × 5 = 50." },
        { q: "Which of the following is an EVEN number?", opts: ["A) 11", "B) 17", "C) 24", "D) 31"], ans: "C", exp: "24 is completely divisible by 2 with no remainder." },
        { q: "How many minutes are there in 1 full hour?", opts: ["A) 50 minutes", "B) 60 minutes", "C) 100 minutes", "D) 24 minutes"], ans: "B", exp: "Standard unit conversion: 1 hour = 60 minutes." },
        { q: "What is the perimeter of a square whose side is 5 cm?", opts: ["A) 10 cm", "B) 20 cm", "C) 25 cm", "D) 15 cm"], ans: "B", exp: "Perimeter of square = 4 × side = 4 × 5 = 20 cm." },
        { q: "Which fraction represents half of a whole pizza?", opts: ["A) 1/4", "B) 1/3", "C) 1/2", "D) 2/3"], ans: "C", exp: "1/2 denotes dividing a whole unit into two equal halves." },
        { q: "How many centimeters make 1 meter?", opts: ["A) 10 cm", "B) 100 cm", "C) 1000 cm", "D) 50 cm"], ans: "B", exp: "1 meter = 100 centimeters." },
        { q: "What is the predecessor of 500?", opts: ["A) 501", "B) 499", "C) 490", "D) 400"], ans: "B", exp: "Predecessor = 500 - 1 = 499." },
        { q: "A dice has how many faces?", opts: ["A) 4", "B) 6", "C) 8", "D) 12"], ans: "B", exp: "A cube/dice possesses 6 square faces." },
        { q: "Solve: 84 - 36 =", opts: ["A) 48", "B) 58", "C) 42", "D) 52"], ans: "A", exp: "84 - 36 = 48." },
        { q: "Which is the smallest 3-digit number?", opts: ["A) 101", "B) 100", "C) 999", "D) 111"], ans: "B", exp: "100 is the first and smallest three-digit integer." }
      ],
      short: [
        { q: `Write the number names for: (a) 48 (b) 75 (c) 92 in words.`, marks: 3, ans: "(a) Forty-Eight (b) Seventy-Five (c) Ninety-Two.", markingScheme: "1 mark each for correct spelling." },
        { q: `Arrange the following numbers in ascending order: 34, 12, 89, 56, 21.`, marks: 3, ans: "Ascending order: 12, 21, 34, 56, 89.", markingScheme: "1 mark for lowest identification, 2 marks for full sequence." },
        { q: `A box contains 24 pencils. 10 pencils are red and the rest are blue. How many blue pencils are in the box?`, marks: 3, ans: "Total = 24. Red = 10. Blue = 24 - 10 = 14 pencils.", markingScheme: "1 mark for statement, 2 marks for correct calculation." },
        { q: `Add using column addition: 45 + 38. Show regrouping steps clearly.`, marks: 3, ans: "45 + 38: 5 + 8 = 13 (carry 1). 4 + 3 + 1 = 8. Total = 83.", markingScheme: "1.5 marks for carry-over regrouping, 1.5 marks for sum." },
        { q: `Find the difference: 72 - 39 using borrowing method.`, marks: 3, ans: "72 - 39: Borrow 1 ten. 12 - 9 = 3. 6 - 3 = 3. Difference = 33.", markingScheme: "1.5 marks for borrow demonstration, 1.5 marks for difference." },
        { q: `A train compartment has 8 rows of seats. Each row has 6 seats. How many total passengers can sit?`, marks: 3, ans: "Total seats = 8 × 6 = 48 passengers.", markingScheme: "1 mark for multiplication formula, 2 marks for calculation." },
        { q: `Write the expanded form for: (a) 456 (b) 709 (c) 830.`, marks: 3, ans: "(a) 400 + 50 + 6 (b) 700 + 0 + 9 (c) 800 + 30 + 0.", markingScheme: "1 mark each for correct place expansion." },
        { q: `Draw and define: (a) A straight line (b) A curved line (c) A closed shape.`, marks: 3, ans: "Straight line: path with zero curve. Curved line: bends smoothly. Closed shape: starting and ending points meet.", markingScheme: "1 mark per definition and sketch." },
        { q: `Convert the following: (a) 3 meters to cm (b) 200 cm to meters (c) 1 kg to grams.`, marks: 3, ans: "(a) 3 × 100 = 300 cm (b) 200 / 100 = 2 meters (c) 1000 grams.", markingScheme: "1 mark each for correct conversion." },
        { q: `If one notebook costs ₹15, what will be the total cost of 5 such notebooks?`, marks: 3, ans: "Cost = ₹15 × 5 = ₹75.", markingScheme: "1 mark for multiplication statement, 2 marks for answer." },
        { q: `Identify the pattern and write the next three terms: 5, 10, 15, 20, __, __, __.`, marks: 3, ans: "Adding 5 each step. Next terms: 25, 30, 35.", markingScheme: "1 mark for rule, 2 marks for 3 terms." },
        { q: `Name any three 3D solids and write the number of flat faces each possesses.`, marks: 3, ans: "1. Cube: 6 faces. 2. Cuboid: 6 faces. 3. Cylinder: 2 flat circular faces.", markingScheme: "1 mark per solid with face count." }
      ],
      long: [
        { q: `Rohan bought a school bag for ₹245, a water bottle for ₹130, and a color box for ₹85. He gave a ₹500 note to the cashier. How much money should he receive back?`, marks: 5, ans: "Total cost = 245 + 130 + 85 = ₹460. Money given = ₹500. Change = 500 - 460 = ₹40.", markingScheme: "2.5 marks for sum of purchases, 2.5 marks for change subtraction." },
        { q: `A rectangular playground is 30 meters long and 20 meters wide. (a) Find its perimeter. (b) If an athlete runs 3 rounds around it, find total distance covered.`, marks: 5, ans: "(a) Perimeter = 2 × (L + W) = 2 × (30 + 20) = 2 × 50 = 100 meters. (b) Total distance = 3 × 100 = 300 meters.", markingScheme: "2.5 marks for perimeter formula and result, 2.5 marks for 3-lap distance." },
        { q: `There are 340 students in Class II. 185 are boys. How many girls are there? Which group has more students and by how much?`, marks: 5, ans: "Girls = 340 - 185 = 155. Boys are more in number. Difference = 185 - 155 = 30 more boys.", markingScheme: "2.5 marks for girls count, 2.5 marks for comparison." },
        { q: `Draw a clock face showing the time 4:45. Explain which hand is the hour hand and which is the minute hand.`, marks: 5, ans: "Minute hand points at 9 (45 mins). Hour hand is near 5. Hour hand is short and thick; minute hand is long.", markingScheme: "2 marks for neat labeled clock, 3 marks for hand positions." },
        { q: `A farmer packed 480 apples into 8 equal crates. (a) How many apples are in each crate? (b) If he sells each crate for ₹600, how much money does he earn?`, marks: 5, ans: "(a) Apples per crate = 480 / 8 = 60 apples. (b) Earnings = 8 × 600 = ₹4,800.", markingScheme: "2.5 marks for division step, 2.5 marks for total revenue." }
      ]
    },
    'Science': {
      mcqs: [
        { q: "Which part of a plant grows under the soil to absorb water and minerals?", opts: ["A) Stem", "B) Leaf", "C) Root", "D) Flower"], ans: "C", exp: "Roots anchor the plant into the ground and absorb moisture and nutrients." },
        { q: "Which animal is commonly known as the 'Ship of the Desert'?", opts: ["A) Horse", "B) Camel", "C) Elephant", "D) Lion"], ans: "B", exp: "Camels can survive long durations without water in arid climates." },
        { q: "How many primary sense organs do human beings possess?", opts: ["A) 4", "B) 5", "C) 6", "D) 3"], ans: "B", exp: "Eyes, ears, nose, tongue, and skin." },
        { q: "Which gas do green plants release during photosynthesis?", opts: ["A) Carbon dioxide", "B) Nitrogen", "C) Oxygen", "D) Hydrogen"], ans: "C", exp: "Plants synthesize glucose and release oxygen." },
        { q: "What gives the characteristic green color to leaves?", opts: ["A) Chlorophyll", "B) Sunlight", "C) Water", "D) Soil"], ans: "A", exp: "Chlorophyll is the photosynthetic pigment reflecting green light." },
        { q: "Which of the following is a nocturnal animal that stays awake at night?", opts: ["A) Cow", "B) Owl", "C) Deer", "D) Horse"], ans: "B", exp: "Owls hunt and stay active primarily at night." },
        { q: "What state of matter is water when it freezes into ice?", opts: ["A) Solid", "B) Liquid", "C) Gas", "D) Vapor"], ans: "A", exp: "Ice has fixed shape and volume, classifying it as a solid." },
        { q: "Which planet in our solar system is known as the Red Planet?", opts: ["A) Venus", "B) Mars", "C) Jupiter", "D) Saturn"], ans: "B", exp: "Iron oxide on Mars' surface imparts its red hue." },
        { q: "Humans breathe in oxygen and breathe out:", opts: ["A) Nitrogen", "B) Carbon dioxide", "C) Helium", "D) Argon"], ans: "B", exp: "Respiration releases carbon dioxide as a cellular byproduct." },
        { q: "Which food component gives our body energy to play and run?", opts: ["A) Carbohydrates & Fats", "B) Vitamins", "C) Minerals", "D) Fiber"], ans: "A", exp: "Carbohydrates and fats are primary energy-giving nutrients." }
      ],
      short: [
        { q: `Name the five sense organs and mention the primary function of each.`, marks: 3, ans: "1. Eyes: Vision. 2. Ears: Hearing. 3. Nose: Smell. 4. Tongue: Taste. 5. Skin: Touch.", markingScheme: "0.5 marks per organ with function." },
        { q: `Differentiate between Living and Non-living things with two examples of each.`, marks: 3, ans: "Living things breathe and grow (e.g. dog, tree). Non-living things do not exhibit metabolic activity (e.g. chair, stone).", markingScheme: "1.5 marks for definition, 1.5 marks for examples." },
        { q: `Why do living organisms need balanced food and clean water? State two reasons.`, marks: 3, ans: "1. Nutrients provide energy for cellular growth. 2. Water facilitates metabolic digestion.", markingScheme: "1.5 marks for food explanation, 1.5 marks for water role." },
        { q: `Name three domestic animals and three wild animals.`, marks: 3, ans: "Domestic: Cow, Dog, Goat. Wild: Tiger, Lion, Elephant.", markingScheme: "1.5 marks for domestic, 1.5 marks for wild." },
        { q: `Explain the differences between Herbivores, Carnivores, and Omnivores with one example of each.`, marks: 3, ans: "Herbivores eat plants (Cow). Carnivores eat meat (Lion). Omnivores eat both plants and meat (Bear/Human).", markingScheme: "1 mark each for definition and example." },
        { q: `What are the three physical states of water? Name their forms.`, marks: 3, ans: "1. Solid form: Ice. 2. Liquid form: Water. 3. Gas form: Steam / Water vapor.", markingScheme: "1 mark per state with example." }
      ],
      long: [
        { q: `Describe the main parts of a flowering plant with a neat labeled diagram. Explain the function of root and leaf.`, marks: 5, ans: "Roots: Anchor and absorb water. Stem: Transports water/nutrients. Leaves: Perform photosynthesis. Flower: Reproductive organ. Fruit: Protects seeds.", markingScheme: "2 marks for labeled diagram, 1.5 marks for root, 1.5 marks for leaf." },
        { q: `Explain the water cycle with its three key stages: Evaporation, Condensation, and Precipitation.`, marks: 5, ans: "1. Evaporation: Sun turns surface water into vapor. 2. Condensation: Vapor cools into clouds. 3. Precipitation: Drops fall as rain.", markingScheme: "1.5 marks for evaporation, 1.5 marks for condensation, 2 marks for precipitation." }
      ]
    }
  };

  // Select appropriate subject bank
  const selectedBank = curriculumBanks[category] || curriculumBanks['Computer Science'];

  // Procedural Generator for additional questions if needed
  const generateProceduralMCQ = (idx, seed) => {
    if (category === 'Computer Science') {
      const concepts = [
        { q: `In computer applications for "${topic}", which operation is performed by pressing Ctrl + S?`, opts: ["A) Save document", "B) Delete file", "C) Print page", "D) Close window"], ans: "A", exp: "Ctrl + S is universal keyboard shortcut to save files." },
        { q: `Which of the following is true about computers compared to humans in "${topic}"?`, opts: ["A) Never makes mistakes on its own", "B) Gets tired after 1 hour", "C) Has feelings", "D) Cannot store data"], ans: "A", exp: "Computers execute instructions with 100% computational accuracy." },
        { q: `What is the main purpose of an antivirus software on a school computer?`, opts: ["A) Play video games", "B) Protect from malicious virus attacks", "C) Paint pictures", "D) Type letters"], ans: "B", exp: "Antivirus protects system files from malware corruption." },
        { q: `Which device connects multiple computers inside a computer lab?`, opts: ["A) Network Switch / Router", "B) Mouse Pad", "C) Scanner", "D) Speaker"], ans: "A", exp: "Routers and switches interconnect devices over local networks." },
        { q: `What does the term 'GUI' stand for in Operating Systems?`, opts: ["A) General User Input", "B) Graphical User Interface", "C) Global Unique Identifier", "D) Great Unified Internet"], ans: "B", exp: "GUI provides visual icons and windows for user interaction." }
      ];
      return concepts[seed % concepts.length];
    } else if (category === 'Mathematics') {
      const a = (seed * 7) + 12;
      const b = (seed * 3) + 8;
      const sum = a + b;
      return {
        q: `Evaluate the following mathematical sum for topic "${topic}": ${a} + ${b} = ?`,
        opts: [`A) ${sum}`, `B) ${sum + 2}`, `C) ${sum - 4}`, `D) ${sum + 10}`],
        ans: "A",
        exp: `${a} + ${b} = ${sum}.`
      };
    } else {
      return {
        q: `Regarding "${topic}", which fundamental principle is widely observed in scientific study?`,
        opts: ["A) Conservation of energy", "B) Instant teleportation", "C) Matter creation from nothing", "D) Vanishing gravity"],
        ans: "A",
        exp: "Conservation of energy dictates energy cannot be created or destroyed."
      };
    }
  };

  const generateProceduralShort = (idx, seed) => {
    if (category === 'Computer Science') {
      const pool = [
        { q: `Explain the importance of organizing files into separate folders on a computer for topic "${topic}".`, ans: "Folders group related files systematically, making retrieval quick and preventing desktop clutter.", scheme: "1.5 marks for explanation, 1.5 marks for practical advantage." },
        { q: `What is the difference between a Desktop computer and a Tablet computer?`, ans: "Desktops are stationary with separate keyboard/mouse. Tablets are touchscreen mobile portable devices.", scheme: "1.5 marks per comparison factor." },
        { q: `List three common input devices used in modern multimedia computer systems.`, ans: "1. Keyboard. 2. Optical Mouse. 3. Webcam / Microphone.", scheme: "1 mark for each device with function." },
        { q: `Why should we never shut down a computer by directly pulling the electrical wall plug?`, ans: "Direct power cuts can corrupt operating system files and physically damage hard disk drive read-heads.", scheme: "1.5 marks for file corruption, 1.5 marks for hardware risk." },
        { q: `Describe the function of the Scroll Wheel located between the mouse buttons.`, ans: "The scroll wheel allows easy upward and downward scrolling across long documents and web pages.", scheme: "1.5 marks for definition, 1.5 marks for usage context." },
        { q: `What is a Computer Network? State one main advantage of networking in school labs.`, ans: "A network connects two or more computers to share resources (like a single printer shared across 20 PCs).", scheme: "1.5 marks for network concept, 1.5 marks for resource sharing." }
      ];
      return pool[seed % pool.length];
    } else if (category === 'Mathematics') {
      return {
        q: `Solve step-by-step for "${topic}": Calculate the perimeter of a rectangle having length ${(seed * 4) + 10} cm and width ${(seed * 2) + 5} cm.`,
        ans: `Perimeter = 2 × (L + W) = 2 × (${(seed * 4) + 10} + ${(seed * 2) + 5}) = ${2 * (((seed * 4) + 10) + ((seed * 2) + 5))} cm.`,
        scheme: "1.5 marks for formula substitution, 1.5 marks for final calculated value."
      };
    } else {
      return {
        q: `Explain two main environmental factors related to "${topic}" and how they impact daily human life.`,
        ans: "Clean air and pure water are critical for cellular respiration and disease prevention.",
        scheme: "1.5 marks per environmental factor with impact."
      };
    }
  };

  const generateProceduralLong = (idx, seed) => {
    if (category === 'Computer Science') {
      const pool = [
        { q: `Discuss the role of Computers in modern society. Explain four distinct fields where computers have revolutionized work for "${topic}".`, ans: "1. Healthcare: Patient diagnostics and MRI machines. 2. Education: Digital smart classes and e-learning. 3. Banking: Online transactions and ATM networks. 4. Aviation: Flight radar and booking.", scheme: "1.25 marks for each distinct field with detailed illustration." },
        { q: `Explain the complete step-by-step workflow of how a computer processes an instruction from Input Unit to Storage.`, ans: "1. Input device captures data. 2. Data loads in RAM. 3. CPU ALU computes result under CU control. 4. Output sent to monitor. 5. Persisted in secondary storage.", scheme: "1 mark for each of the 5 sequential stages." },
        { q: `What are Cyber Safety guidelines? Describe five essential security habits every student must observe while using computers.`, ans: "1. Never share confidential passwords. 2. Do not click unverified email attachments. 3. Keep Antivirus active. 4. Use strong alphanumeric passcodes. 5. Inform teachers/parents on suspicious activity.", scheme: "1 mark per safety rule." },
        { q: `Differentiate comprehensively between Primary Memory (RAM, ROM) and Secondary Memory (Hard Disk, SSD, Pen Drive).`, ans: "Primary memory is volatile and fast, directly wired to CPU bus. Secondary memory provides permanent, high-capacity, cost-effective long-term file retention.", scheme: "2.5 marks for primary memory breakdown, 2.5 marks for secondary memory comparison." }
      ];
      return pool[seed % pool.length];
    } else if (category === 'Mathematics') {
      return {
        q: `A school organized an educational exhibition for "${topic}". 450 students visited on Day 1, 380 on Day 2, and 520 on Day 3. (a) Calculate total attendees. (b) Find the difference between highest and lowest day attendance.`,
        ans: `(a) Total = 450 + 380 + 520 = 1350 attendees. (b) Difference = 520 - 380 = 140 attendees.`,
        scheme: "2.5 marks for total addition, 2.5 marks for subtraction difference."
      };
    } else {
      return {
        q: `Describe the experimental procedure to test scientific principles in "${topic}". List materials, hypothesis, observations, and conclusion.`,
        ans: "Materials assembled, controlled parameters tested, data logged systematically, and conclusion validated against hypothesis.",
        scheme: "2.5 marks for apparatus and steps, 2.5 marks for data analysis."
      };
    }
  };

  // Helper to ensure EXACT requested count
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

  // Build exact question lists
  const rawMCQs = buildExactList(selectedBank.mcqs || [], numMCQ, generateProceduralMCQ);
  const rawShorts = buildExactList(selectedBank.short || [], numShort, generateProceduralShort);
  const rawLongs = buildExactList(selectedBank.long || [], numLong, generateProceduralLong);

  // Format with consistent IDs and continuous numbering
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
  // 1. Generate full structured Exam Question Paper + Answer Key
  generateExamPaper: async (params) => {
    try {
      const response = await axiosInstance.post('/ai/generate-exam-paper', params);
      if (response.data && response.data.success && response.data.data) {
        const d = response.data.data;
        // Verify response matches requested counts
        const hasMCQs = Array.isArray(d.sectionA_MCQ) && d.sectionA_MCQ.length >= (Number(params.numMCQ) || 1);
        const hasShort = Array.isArray(d.sectionB_Short) && d.sectionB_Short.length >= (Number(params.numShort) || 1);
        if (hasMCQs && hasShort) {
          return response.data;
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, using curriculum engine:', err?.message);
    }
    // High-speed precision curriculum generator
    const paper = fallbackCurriculumPaper(params);
    return {
      success: true,
      source: 'curriculum-engine',
      data: paper
    };
  },

  // 2. Generate personalized Student Report Card Remarks
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

  // 3. Generate Teacher 45-Minute Lesson Plan
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
