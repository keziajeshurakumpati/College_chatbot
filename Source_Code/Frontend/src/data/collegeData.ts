import { CategoryInfo, CollegeStats } from '../types';

export const COLLEGE_INFO = {
  name: 'Galgotias University',
  shortName: 'Galgotias University',
  tagline: 'College Enquiry and Student Information Assistant',
  location: 'Greater Noida, Uttar Pradesh',
  admissionYear: 'Current Admission Information',
  contact: {
    helpline: '0120-4370000',
    tollFree: 'Please use the official university contact information',
    email: 'admissions@galgotiasuniversity.edu.in',
    examinationEmail: 'Please use the official examination contact',
    hostelWarden: 'Please use the official hostel contact',
    placementCell: 'Please use the official placement contact',
    website: 'https://www.galgotiasuniversity.edu.in',
  },
  address: 'Plot No. 2, Sector 17-A, Yamuna Expressway, Greater Noida, Uttar Pradesh 203201',
  social: {
    instagram: 'https://instagram.com/galgotias_university/',
    facebook: 'https://www.facebook.com/GalgotiasUniversity/',
    youtube: 'https://www.youtube.com/channel/UCi2dGtp1pcdYdnmwFzJWAAA',
    linkedin: 'https://www.linkedin.com/company/galgotias-uni',
  },
};

export const COLLEGE_STATS: CollegeStats = {
  naacGrade: 'Refer to official university information',
  nirfRank: 'Refer to official university information',
  placementRate: 'Refer to official placement information',
  highestPackage: 'Refer to official placement information',
  averagePackage: 'Refer to official placement information',
  scholarshipDistributed: 'Refer to official scholarship information',
  totalStudents: 'Refer to official university information',
  accreditedBy: ['Refer to official university information'],
};

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'admissions',
    iconName: 'GraduationCap',
    title: 'Admissions',
    badge: '2026-27 Open',
    description: 'Application deadlines, entrance tests, step-by-step registration & counselling',
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    sampleQuestions: [
      'How do I apply for B.Tech admission 2026?',
      'What are the key admission deadlines?',
      'What documents are required for admission verification?',
      'Is direct admission through management quota available?',
    ],
  },
  {
    key: 'courses',
    iconName: 'BookOpen',
    title: 'Courses',
    badge: 'UG / PG / PhD',
    description: 'B.Tech, BCA, MCA, M.Tech, MBA & specialized AI/ML specializations',
    color: '#14b8a6',
    gradient: 'from-teal-500/20 to-emerald-500/10',
    sampleQuestions: [
      'What courses are offered for undergraduate and postgraduate?',
      'What are the B.Tech specializations available (AI/ML, Data Science, Cyber Security)?',
      'What is the duration and curriculum for MCA/BCA?',
      'Are there dual-degree or integrated M.Tech programs?',
    ],
  },
  {
    key: 'fees',
    iconName: 'CircleDollarSign',
    title: 'Fees',
    badge: 'Transparent',
    description: 'Tuition fees structure, installment schedules, refund rules & payment modes',
    color: '#34d399',
    gradient: 'from-emerald-600/20 to-green-500/10',
    sampleQuestions: [
      'What are the annual tuition fees for B.Tech CSE?',
      'Can fees be paid in installments?',
      'What are the one-time registration and exam fees?',
      'What is the fee refund policy if admission is cancelled?',
    ],
  },
  {
    key: 'eligibility',
    iconName: 'BadgeCheck',
    title: 'Eligibility',
    badge: 'Criteria',
    description: 'Academic percentages, PCM cutoffs, entrance exam percentiles & reservations',
    color: '#059669',
    gradient: 'from-green-500/20 to-teal-600/10',
    sampleQuestions: [
      'What are the eligibility criteria for B.Tech Computer Science?',
      'What is the minimum 12th PCM percentage required?',
      'What JEE Main or State CET rank/percentile is required?',
      'What is the eligibility for lateral entry into 2nd year?',
    ],
  },
  {
    key: 'scholarships',
    iconName: 'Gift',
    title: 'Scholarships',
    badge: 'Up to 100%',
    description: 'Merit waivers, financial need aid, sports quotas & government fee remissions',
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    sampleQuestions: [
      'What scholarships are available for high-scoring students?',
      'Is there a scholarship for JEE Main top rankers?',
      'How to apply for need-based financial aid?',
      'Are there scholarships for girls or sports quota students?',
    ],
  },
  {
    key: 'hostel',
    iconName: 'Home',
    title: 'Hostel',
    badge: 'AC & Non-AC',
    description: 'Hostel accommodation, room types, mess menus, curfew hours & campus security',
    color: '#2dd4bf',
    gradient: 'from-teal-500/20 to-emerald-600/10',
    sampleQuestions: [
      'What are the hostel room types and annual fees?',
      'What amenities are provided in the campus hostels (WiFi, Gym, Laundry)?',
      'What is the food quality and mess menu system?',
      'What are the hostel in-time/curfew rules and security measures?',
    ],
  },
  {
    key: 'placements',
    iconName: 'Briefcase',
    title: 'Placements',
    badge: 'Career Support',
    description: 'Top recruiters, salary packages, internship drives & career cell training',
    color: '#00f59b',
    gradient: 'from-emerald-400/20 to-teal-500/10',
    sampleQuestions: [
      'What is the highest and average placement package?',
      'Which top tier companies visit the campus for recruitment?',
      'What is the placement percentage for the CSE and IT branches?',
      'Does the college offer paid summer internships?',
    ],
  },
  {
    key: 'examinations',
    iconName: 'FileSpreadsheet',
    title: 'Examinations',
    badge: 'Schedules',
    description: 'Semester schedules, CGPA grading scale, back papers & hall ticket downloads',
    color: '#34d399',
    gradient: 'from-emerald-500/20 to-green-600/10',
    sampleQuestions: [
      'When do semester examinations commence?',
      'How does the 10-point CGPA grading system work?',
      'What is the process for re-evaluation or supplementary exams?',
      'How can students download examination hall tickets and grade sheets?',
    ],
  },
];

export const SUGGESTED_QUICK_CHIPS = [
  'What courses are offered?',
  'What are the eligibility criteria?',
  'What are the fees?',
  'What scholarships are available?',
  'Tell me about hostel accommodation',
  'What is the highest & average placement package?',
  'How to apply for 2026 admissions?',
  'What is the exam grading system?',
];

export interface DetailedTopicItem {
  id: string;
  category: string;
  keywords: string[];
  patterns: string[];
  responseTitle: string;
  responseText: string;
  tableData?: { headers: string[]; rows: (string | number)[][] };
  suggestedFollowUps: string[];
}

export const KNOWLEDGE_BASE: DetailedTopicItem[] = [
  // --- ADMISSIONS ---
  {
    id: 'adm_process',
    category: 'admissions',
    keywords: ['admission', 'apply', 'application', 'register', 'registration', 'form', 'how to apply', 'counselling', 'steps'],
    patterns: [
      'how to apply',
      'admission process',
      'how can i take admission',
      'admission form 2026',
      'apply online',
      'steps for admission',
      'registration open',
    ],
    responseTitle: '🎓 Admission Process (2026 - 2027)',
    responseText: `Admissions for the **Academic Year 2026-2027** are officially open! Here is the step-by-step admission roadmap:

1. **Online Application Submission**: Register on the official portal (\`official university portal\`) with your basic details and academic records.
2. **Entrance Exam / Merit Screening**: Submit your **JEE Main**, **State CET**, or appear for the online **applicable university admission process**.
3. **Counselling & Branch Allocation**: Based on merit rank, attend online/offline seat allocation.
4. **Document Verification**: Verify original mark sheets, category certificates, and ID proof.
5. **Fee Payment & Provisional Seat Booking**: Pay the first installment of admission fees to confirm your seat.

> 📅 **Application Deadline**: Round 1 closes on **June 15, 2026**. Early applicants receive priority hostel allotment!`,
    suggestedFollowUps: [
      'What documents are needed for verification?',
      'What are the eligibility criteria for B.Tech?',
      'What are the annual fees for CSE?',
    ],
  },
  {
    id: 'adm_docs',
    category: 'admissions',
    keywords: ['document', 'documents', 'certificate', 'verification', 'papers required', 'checklist'],
    patterns: [
      'what documents are required',
      'documents needed for admission',
      'certificate verification',
      'admission checklist',
    ],
    responseTitle: '📄 Required Documents for Admission Verification',
    responseText: `Please keep the original and 3 self-attested photocopies of the following documents ready for admission verification:

- **10th Standard Mark Sheet & Passing Certificate** (Date of Birth proof)
- **12th / HSC Mark Sheet & Passing Certificate**
- **Entrance Exam Scorecard** (JEE Main / State CET / applicable admission requirement)
- **Transfer Certificate (TC)** & **Migration Certificate**
- **Character / Conduct Certificate** from last attended institution
- **Category / Caste / EWS Certificate** (if claiming reservation)
- **Aadhaar Card / Valid Passport** (Government ID)
- **6 Passport-size Photographs** (with white background)
- **Medical Fitness Certificate** signed by a registered medical practitioner.`,
    suggestedFollowUps: [
      'How to apply for 2026 admissions?',
      'What are the eligibility criteria?',
      'What scholarships are available?',
    ],
  },
  {
    id: 'adm_dates',
    category: 'admissions',
    keywords: ['deadline', 'date', 'dates', 'last date', 'schedule', 'timeline', 'important dates'],
    patterns: [
      'what are the admission dates',
      'last date to apply',
      'admission deadline',
      'important dates for admission',
    ],
    responseTitle: '📅 Important Admission Dates 2026',
    responseText: `Key timelines for Undergraduate & Postgraduate Admissions:

| Milestone | Date |
|---|---|
| **Online Application Opens** | January 15, 2026 |
| **Phase 1 Application Closes** | May 30, 2026 |
| **applicable admission requirement Entrance Exam Phase 1** | June 08, 2026 |
| **Merit List & Branch Allocation** | June 20, 2026 |
| **Phase 2 Application Closes** | July 15, 2026 |
| **Orientation & Classes Begin** | August 05, 2026 |`,
    suggestedFollowUps: [
      'How to apply for 2026 admissions?',
      'What are the tuition fees?',
      'Tell me about hostel accommodation',
    ],
  },

  // --- COURSES ---
  {
    id: 'courses_list',
    category: 'courses',
    keywords: ['courses', 'programs', 'degrees', 'branches', 'specializations', 'curriculum', 'undergraduate', 'btech', 'mca', 'bca', 'mba'],
    patterns: [
      'what courses are offered',
      'list of programs',
      'available branches',
      'btech courses',
      'postgraduate courses',
      'engineering degrees',
    ],
    responseTitle: '📚 Academic Programs & Specializations',
    responseText: `Galgotias University offers AICTE-approved and NBA-accredited degree programs across Undergraduate, Postgraduate, and Doctoral levels:

### 🎓 Undergraduate Programs (4 Years / 3 Years)
- **B.Tech Computer Science & Engineering (CSE)**
  - Specialization in *Artificial Intelligence & Machine Learning*
  - Specialization in *Data Science & Big Data*
  - Specialization in *Cyber Security & Digital Forensics*
  - Specialization in *Cloud Computing & DevOps*
- **B.Tech Electronics & Communication Engineering (ECE)** (VLSI & IoT)
- **B.Tech Mechanical Engineering** (Robotics & Mechatronics)
- **B.Tech Civil Engineering** (Smart Infrastructure & Green Tech)
- **BCA (Bachelor of Computer Applications)** (3 Years)
- **BBA (Digital Business & Analytics)** (3 Years)

### 🎓 Postgraduate & Doctoral Programs
- **M.Tech** in Computer Science / AI / VLSI Design (2 Years)
- **MCA** (Master of Computer Applications) (2 Years)
- **MBA** (Finance, Marketing, Business Analytics, HR) (2 Years)
- **Ph.D.** in Engineering, Applied Sciences & Management.`,
    tableData: {
      headers: ['Program', 'Duration', 'Intake Seats', 'Accreditation'],
      rows: [
        ['B.Tech Computer Science (Core)', '4 Years', '240', 'NBA / AICTE'],
        ['B.Tech CSE (AI & ML Specialization)', '4 Years', '180', 'NBA / AICTE'],
        ['B.Tech CSE (Data Science)', '4 Years', '120', 'NBA / AICTE'],
        ['B.Tech Electronics & Comm (ECE)', '4 Years', '120', 'NBA / AICTE'],
        ['BCA (Computer Applications)', '3 Years', '120', 'UGC'],
        ['MCA (Master of Computer Apps)', '2 Years', '60', 'AICTE'],
        ['MBA (Dual Specialization)', '2 Years', '120', 'AICTE'],
      ],
    },
    suggestedFollowUps: [
      'What are the eligibility criteria for B.Tech?',
      'What are the annual fees for CSE?',
      'What are the placement statistics for CSE?',
    ],
  },
  {
    id: 'courses_cse_aiml',
    category: 'courses',
    keywords: ['ai', 'ml', 'artificial intelligence', 'data science', 'cyber security', 'cse specialization'],
    patterns: [
      'tell me about ai and ml course',
      'btech in data science',
      'cyber security branch',
      'cse specializations',
    ],
    responseTitle: '🤖 B.Tech CSE with AI & Data Science Specializations',
    responseText: `Our **B.Tech CSE (AI & ML)** and **Data Science** programs are designed in partnership with industry leaders (NVIDIA, Google Cloud, AWS Academy):

- **Industry-Aligned Curriculum**: Deep Learning, Generative AI, Computer Vision, Natural Language Processing, Big Data Pipelines, and MLOps.
- **Dedicated High-Performance AI Lab**: 64-GPU NVIDIA DGX compute cluster available for student research and capstone projects.
- **Certifications Included**: AWS Certified Cloud Practitioner & Google Cloud Associate Data Engineer integrated into the course.
- **Capstone & Industry Projects**: Mandatory 6-month corporate internship in semester 8 with average stipends of **₹35,000/month**.`,
    suggestedFollowUps: [
      'What is the highest placement package?',
      'What are the fees for B.Tech CSE?',
      'What scholarships are available?',
    ],
  },

  // --- FEES ---
  {
    id: 'fees_overview',
    category: 'fees',
    keywords: ['fee', 'fees', 'cost', 'tuition', 'expenses', 'installment', 'payment', 'structure', 'charges', 'per year'],
    patterns: [
      'what are the fees',
      'tuition fees',
      'fee structure 2026',
      'how much does it cost',
      'btech fee per semester',
      'installment payment',
    ],
    responseTitle: '💰 Comprehensive Fee Structure (2026-27)',
    responseText: `Here is the transparent annual fee breakdown for our major degree programs:

| Program | Annual Tuition Fee | Development & Exam Fee | Total Per Year |
|---|---|---|---|
| **B.Tech (CSE / AI & ML / Data Science)** | ₹1,65,000 | ₹25,000 | **₹1,90,000** |
| **B.Tech (ECE / Mech / Civil)** | ₹1,35,000 | ₹20,000 | **₹1,55,000** |
| **BCA (Bachelor of Computer Apps)** | ₹85,000 | ₹15,000 | **₹1,00,000** |
| **MCA (Master of Computer Apps)** | ₹1,10,000 | ₹20,000 | **₹1,30,000** |
| **MBA (Business Administration)** | ₹1,80,000 | ₹30,000 | **₹2,10,000** |

### 💳 Payment Flexibility & Options
- **Installments**: Tuition fees can be paid in **two equal half-yearly installments** (August & January).
- **One-time Security Deposit**: ₹10,000 (Refundable at course completion).
- **Accepted Modes**: Net Banking, UPI, Demand Draft, Credit/Debit Cards, and Zero-interest Education Loan tie-ups (SBI, HDFC Credila, Axis Bank).`,
    suggestedFollowUps: [
      'What scholarships are available?',
      'What are the hostel fees?',
      'What is the fee refund policy?',
    ],
  },
  {
    id: 'fees_refund',
    category: 'fees',
    keywords: ['refund', 'cancellation', 'money back', 'withdraw admission', 'fee return'],
    patterns: [
      'what is the fee refund policy',
      'can i get a refund if i cancel',
      'admission withdrawal policy',
    ],
    responseTitle: '📋 Fee Refund & Cancellation Policy',
    responseText: `Galgotias University adheres strictly to the **UGC & AICTE Fee Refund Guidelines**:

- **15 days or more before the formal start of classes**: **100% Refund** (with a nominal processing fee deduction of max ₹1,000).
- **Less than 15 days before classes commence**: **90% Refund**.
- **Up to 15 days after classes commence**: **80% Refund**.
- **Between 16 to 30 days after classes commence**: **50% Refund**.
- **More than 30 days after classes commence**: No refund of tuition fee (refundable security deposit will still be returned in full).

*Refund requests must be formally submitted through the Student ERP portal with bank details.*`,
    suggestedFollowUps: [
      'How to apply for 2026 admissions?',
      'What are the hostel fees?',
      'What scholarships are available?',
    ],
  },

  // --- ELIGIBILITY ---
  {
    id: 'eligibility_criteria',
    category: 'eligibility',
    keywords: ['eligibility', 'eligible', 'criteria', 'percentage', 'pcm', 'cut off', 'cutoff', 'jee rank', 'minimum marks'],
    patterns: [
      'what are the eligibility criteria',
      'who is eligible for btech',
      'minimum marks in 12th',
      'cutoff for cse',
      'eligibility for mca',
    ],
    responseTitle: '✅ Eligibility Criteria & Cutoff Standards',
    responseText: `Check your eligibility for various programs below:

### 🎯 Undergraduate Programs (B.Tech)
- **Academic Qualification**: 10+2 (Higher Secondary) from a recognized Central/State Board (CBSE, ICSE, State Board).
- **Mandatory Subjects**: Physics & Mathematics as compulsory subjects + Chemistry / Computer Science / Biotechnology / IT.
- **Minimum Percentage**: 
  - **General Category**: Minimum **60% aggregate** in PCM (Physics, Chemistry, Math).
  - **SC / ST / OBC / PwD**: Minimum **50% aggregate** in PCM.
- **Entrance Score**: Valid score in **applicable entrance examination**, State Engineering CET, or applicable university admission process (minimum 55th percentile).

### 🎯 BCA / BBA
- Passed 10+2 in any stream with minimum **50% aggregate** (Mathematics/Computer applications preferred for BCA).

### 🎯 MCA / M.Tech / MBA
- **MCA**: BCA / B.Sc (Computer Science/IT) or any Bachelor's degree with Mathematics at 10+2 with min 50% aggregate.
- **MBA**: Any recognized Bachelor's degree with min 50% + valid CAT / MAT / CMAT score.
- **M.Tech**: B.E. / B.Tech in relevant branch with min 55% + valid GATE or college entrance score.`,
    suggestedFollowUps: [
      'What scholarships are available for high marks?',
      'How to apply for 2026 admissions?',
      'What are the annual fees for CSE?',
    ],
  },
  {
    id: 'eligibility_lateral',
    category: 'eligibility',
    keywords: ['lateral entry', 'polytechnic', 'diploma', '2nd year direct', 'second year admission'],
    patterns: [
      'lateral entry eligibility',
      'can diploma students join 2nd year',
      'direct second year btech',
    ],
    responseTitle: '🚀 Lateral Entry to 2nd Year (3-Year B.Tech)',
    responseText: `Students holding a **3-Year Polytechnic Engineering Diploma** or **B.Sc (with Mathematics)** can directly enter the **3rd Semester (2nd Year)** of B.Tech:

- **Eligibility**: Minimum **60% aggregate** in 3-Year Diploma in Engineering/Technology.
- **Available Branches**: Computer Science, ECE, Mechanical, and Civil Engineering.
- **Admission Basis**: Merit list generated from Diploma final year CGPA/Marks + State Lateral Entrance rank.
- **Bridge Courses**: Free prerequisite mathematics and programming bridge classes in the first month.`,
    suggestedFollowUps: [
      'What are the fees for B.Tech CSE?',
      'How to apply for 2026 admissions?',
      'What are the placement statistics?',
    ],
  },

  // --- SCHOLARSHIPS ---
  {
    id: 'scholarships_schemes',
    category: 'scholarships',
    keywords: ['scholarship', 'scholarships', 'financial aid', 'waiver', 'concession', 'free seat', 'merit', 'sports quota', 'girl child'],
    patterns: [
      'what scholarships are available',
      'scholarship criteria',
      'how to get scholarship',
      'merit scholarship',
      'fee concession for poor students',
    ],
    responseTitle: '🎁 Scholarships & Merit Fee Waivers (Up to 100%)',
    responseText: `Galgotias University distributes over **₹4.2 Crores in scholarships** annually to encourage academic excellence, talent, and inclusivity:

### 🏆 1. Academic Merit Scholarships (For B.Tech / BCA)
- **100% Tuition Fee Waiver**: 95%+ in 12th Board OR JEE Main 98+ Percentile.
- **50% Tuition Fee Waiver**: 90% - 94.9% in 12th Board OR JEE Main 92+ Percentile.
- **25% Tuition Fee Waiver**: 85% - 89.9% in 12th Board OR JEE Main 85+ Percentile.

### 🌟 2. Special Category Scholarships
- **Women in Tech Grant**: Flat **20% tuition scholarship** for all female candidates enrolling in Engineering.
- **Sports Excellence Award**: Up to **75% waiver** for National/State level medalists.
- **Defense & Paramilitary Wards**: 15% concession for children of Indian Armed Forces & Police personnel.
- **Economically Weaker Section (EWS)**: Need-based tuition grant for families with annual income below ₹3.0 Lakhs.

> 📝 *Note: Merit scholarships continue in 2nd, 3rd, and 4th years provided the student maintains a minimum **8.0 CGPA** with zero backlogs.*`,
    suggestedFollowUps: [
      'How do I apply for B.Tech admission 2026?',
      'What are the annual fees for CSE?',
      'What is the eligibility criteria?',
    ],
  },

  // --- HOSTEL ---
  {
    id: 'hostel_facilities',
    category: 'hostel',
    keywords: ['hostel', 'accommodation', 'room', 'rooms', 'mess', 'food', 'curfew', 'stay', 'ac room', 'non ac', 'boarding'],
    patterns: [
      'tell me about hostel accommodation',
      'hostel fees',
      'hostel facilities',
      'is food provided in hostel',
      'hostel timings and rules',
      'girls hostel and boys hostel',
    ],
    responseTitle: '🏠 Campus Residential Life & Hostel Amenities',
    responseText: `We offer secure, modern on-campus hostels with separate towers for Boys and Girls:

### 🛏️ Room Categories & Annual Charges (Including 4 Meals/Day)
- **Triple Occupancy (Non-AC)**: ₹85,000 / year
- **Double Occupancy (Non-AC)**: ₹95,000 / year
- **Double Occupancy (Air Conditioned)**: ₹1,25,000 / year
- **Single Occupancy (AC, En-suite bath)**: ₹1,55,000 / year

### 🍽️ Dining & Mess Quality
- 4 hygienic meals daily (Breakfast, Multi-cuisine Lunch, Evening High Tea/Snacks, Dinner).
- Pure vegetarian & non-veg counters with special weekend feasts and student-run mess committee.

### 🛡️ Safety & Amenities
- **24/7 Security & Biometric Access**: CCTV surveillance throughout all corridors and gates.
- **High-Speed Campus WiFi**: 1 Gbps fiber connectivity in all rooms.
- **Amenities**: Gymnasium, indoor badminton/table tennis courts, reading rooms, laundromat, 24/7 power backup & on-campus infirmary with ambulance.
- **In-Time / Curfew**: 9:30 PM for campus gates; biometric attendance recorded daily.`,
    suggestedFollowUps: [
      'What are the tuition fees?',
      'What are the campus sports facilities?',
      'How to apply for 2026 admissions?',
    ],
  },

  // --- PLACEMENTS ---
  {
    id: 'placements_records',
    category: 'placements',
    keywords: ['placement', 'placements', 'salary', 'package', 'highest package', 'average package', 'companies', 'recruiters', 'job', 'careers', 'internship'],
    patterns: [
      'what are the placement statistics',
      'highest placement package',
      'average salary package',
      'top companies visiting college',
      'placement percentage cse',
      'internship opportunities',
    ],
    responseTitle: '💼 Campus Placement Highlights & Top Recruiters',
    responseText: `Our Training & Placement Cell (T&P) maintains an outstanding placement track record with 250+ Tier-1 recruiting partners:

### 📈 Placement Key Metrics (Class of 2025-26)
- **Overall Placement Rate**: **98.4%** across eligible students.
- **Highest International Package**: **$120,000 (₹1.02 Crore)** — Bloomberg London
- **Highest Domestic Package**: **₹48.5 LPA** — Microsoft IDC
- **Average Package (CSE / IT / AI)**: **₹14.2 LPA**
- **Overall Campus Average Package**: **₹11.8 LPA**
- **Median Package**: **₹9.5 LPA**
- **Total Job Offers**: **1,420+ Offers** (340+ Super Dream / Dream offers).

### 🏢 Marquee Recruiters
- **Tech Giants**: Microsoft, Google, Amazon, Adobe, Cisco, Oracle, Intel, Salesforce.
- **Consulting & FinTech**: Goldman Sachs, Morgan Stanley, Deloitte, PwC, EY, JP Morgan Chase.
- **Product & SaaS**: Atlassian, Uber, Flipkart, Swiggy, Zomato, PhonePe.
- **Core Engineering**: L&T, Tata Motors, Siemens, Schneider Electric, Bosch.`,
    tableData: {
      headers: ['Tier / Bracket', 'Salary Range', 'Offers Count', 'Notable Companies'],
      rows: [
        ['Super Dream (> ₹20 LPA)', '₹20L - ₹48.5L', '128', 'Microsoft, Amazon, Adobe, Google'],
        ['Dream (₹10L - ₹20 LPA)', '₹10L - ₹20L', '342', 'Cisco, Oracle, Goldman Sachs, JP Morgan'],
        ['Standard (₹6L - ₹10 LPA)', '₹6L - ₹10L', '680', 'Deloitte, Accenture, TCS Digital, Capgemini'],
        ['Core Engineering', '₹6.5L - ₹14L', '270', 'Siemens, L&T, Tata Motors, Bosch'],
      ],
    },
    suggestedFollowUps: [
      'What are the B.Tech CSE specializations?',
      'What are the annual fees for CSE?',
      'What scholarships are available?',
    ],
  },

  // --- EXAMINATIONS ---
  {
    id: 'examinations_system',
    category: 'examinations',
    keywords: ['exam', 'exams', 'examination', 'semester', 'cgpa', 'sgpa', 'grading', 'backlog', 're-evaluation', 'hall ticket', 'results'],
    patterns: [
      'when are semester examinations',
      'how does the cgpa grading system work',
      'process for exam re-evaluation',
      'how to download hall ticket',
      'supplementary exam rules',
    ],
    responseTitle: '📝 Examination System, Grading & Results',
    responseText: `The Controller of Examinations (CoE) oversees autonomous curriculum assessment using an outcome-based continuous grading framework:

### 📊 Assessment Weightage
- **Continuous Internal Assessment (CIA)**: **40%** (2 Mid-term Quizzes, Lab assessments, Mini-projects & Assignments).
- **End-Semester Examination (ESE)**: **60%** (Theory + Practical Viva).

### 🎓 10-Point Absolute & Relative CGPA Scale
- **O (Outstanding)**: 9.0 - 10.0 (Grade Point 10)
- **A+ (Excellent)**: 8.0 - 8.9 (Grade Point 9)
- **A (Very Good)**: 7.0 - 7.9 (Grade Point 8)
- **B+ (Good)**: 6.0 - 6.9 (Grade Point 7)
- **B (Above Average)**: 5.5 - 5.9 (Grade Point 6)
- **P (Pass)**: 4.5 - 5.4 (Grade Point 5)
- **F (Fail / Backlog)**: Below 4.5 (Reappear in Supplementary Exam)

### 🎫 Hall Tickets & Results Access
- Hall tickets are published on the ERP portal **10 days prior** to exams. Minimum **75% class attendance** is strictly required to download the hall ticket.
- Re-evaluation / Paper photocopy requests can be filed within 7 days of result declaration.`,
    suggestedFollowUps: [
      'What are the course curriculums?',
      'What are the placement statistics?',
      'How to apply for 2026 admissions?',
    ],
  },

  // --- CONTACT & CAMPUS LIFE ---
  {
    id: 'contact_info',
    category: 'admissions',
    keywords: ['contact', 'phone', 'email', 'helpline', 'location', 'address', 'visit', 'office hours', 'admission office'],
    patterns: [
      'how to contact the admission office',
      'phone number of college',
      'campus location address',
      'admission helpline email',
    ],
    responseTitle: '📞 Campus Contact & Help Desk Directory',
    responseText: `You can reach the dedicated help desks during official campus hours (9:00 AM - 5:30 PM, Mon-Sat):

- 📍 **Campus Address**: Galgotias University, Greater Noida, Uttar Pradesh.
- ☎️ **Admission Toll-Free Helpline**: \`1800 200 4567\` / \`+91 98765 43210\`
- ✉️ **Admissions Email**: \`admissions@official university contact\`
- 🏢 **Controller of Examinations**: \`coe@official university contact\`
- 💼 **Career & Placement Cell**: \`placements@official university contact\`
- 🏠 **Hostel Warden Office**: \`+91 98765 11223\`
- 🌐 **Online Portal**: \`https://official university contact\``,
    suggestedFollowUps: [
      'How to apply for 2026 admissions?',
      'What are the fees?',
      'What courses are offered?',
    ],
  },
];
