
export const COMPANY_DETAIL = {
  google: {
    name: "Google", color: "#4285F4", logo: "G",
    tagline: "Don't be evil. Do be prepared.",
    package: "40–80 LPA", difficulty: "Hard", rounds: 5, hired: "2,000+/yr", tier: "FAANG",
    about: "Google hires for SWE, SRE, and PM roles. Known for highly algorithmic interviews focused on problem-solving, scalability, and clean code. Culture values intellectual curiosity and data-driven decisions.",
    roles: ["Software Engineer (SWE)", "SRE", "SWE Intern", "PM", "Data Engineer"],
    stats: { avgDays: 45, offerRate: "2%", avgRounds: 5, salaryRange: "40–80 LPA" },
    rounds: [
      { name: "Online Assessment",         type: "OA",        duration: "90 min",  desc: "2 coding problems on Google's internal platform. Focus: arrays, strings, graphs. Medium–Hard difficulty." },
      { name: "Phone Screen",              type: "Technical", duration: "45 min",  desc: "1 DSA problem + follow-ups on time/space complexity. Conducted by a Googler via Google Meet." },
      { name: "Onsite Round 1",            type: "Technical", duration: "45 min",  desc: "DSA-heavy: trees, graphs, DP. Expect 1–2 problems. Think aloud throughout." },
      { name: "Onsite Round 2",            type: "Technical", duration: "45 min",  desc: "System Design (senior roles) or more DSA/behavioral for freshers." },
      { name: "Googleyness & Leadership",  type: "Behavioral", duration: "45 min", desc: "Culture fit, past experiences, handling ambiguity. Uses STAR format." },
    ],
    syllabus: {
      "Data Structures": ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & BST", "Heaps", "Graphs (BFS/DFS)", "Tries", "Hash Maps"],
      "Algorithms":      ["Sorting & Searching", "Binary Search", "Two Pointers", "Sliding Window", "Dynamic Programming", "Greedy", "Backtracking"],
      "System Design":   ["Scalability basics", "Load balancing", "Caching", "Database sharding", "CAP theorem", "Rate limiting"],
      "CS Fundamentals": ["OS basics", "Networking (HTTP/DNS)", "Concurrency"],
    },
    pyqs: [
      { q: "Find the longest substring without repeating characters.",      tag: "Sliding Window", difficulty: "Medium", freq: "Very High" },
      { q: "Given a binary tree, find the level-order traversal.",          tag: "Trees",          difficulty: "Easy",   freq: "High"      },
      { q: "Word break problem — can the string be segmented into words?",  tag: "DP",             difficulty: "Medium", freq: "High"      },
      { q: "Design a URL shortener like bit.ly.",                           tag: "System Design",  difficulty: "Hard",   freq: "High"      },
      { q: "Find K closest points to origin.",                              tag: "Heap",           difficulty: "Medium", freq: "High"      },
      { q: "Number of islands — count connected components in a grid.",     tag: "Graphs",         difficulty: "Medium", freq: "Very High" },
      { q: "Implement LRU Cache.",                                          tag: "Design",         difficulty: "Medium", freq: "High"      },
      { q: "Serialize and deserialize a binary tree.",                      tag: "Trees",          difficulty: "Hard",   freq: "Medium"    },
    ],
    tips: [
      "Google values clean, readable code. Name variables well, don't over-optimize prematurely.",
      "Always clarify constraints before diving in. Ask about input size, edge cases.",
      "Think out loud — interviewers are evaluating your thought process, not just the answer.",
      "Practice on Leetcode with the 'Google' tag — focus on Medium difficulty.",
      "For system design, always start with requirements and clarifications.",
      "Behavioral: have 3–4 strong STAR stories ready about past projects, failures, and leadership.",
    ],
    resources: [
      { title: "Leetcode Google Tag",            type: "Practice" },
      { title: "Cracking the Coding Interview",  type: "Book"     },
      { title: "System Design Primer (GitHub)",  type: "Resource" },
      { title: "Google SWE Interview Guide",     type: "Guide"    },
    ],
  },

  amazon: {
    name: "Amazon", color: "#FF9900", logo: "A",
    tagline: "Customer obsession starts at the interview.",
    package: "30–65 LPA", difficulty: "Hard", rounds: 4, hired: "5,000+/yr", tier: "FAANG",
    about: "Amazon's process heavily emphasizes Leadership Principles (LPs) in every round. Technical rounds test DSA and OOP design. Every interviewer is a 'Bar Raiser' or LP evaluator.",
    roles: ["SDE-1", "SDE-2", "SDE Intern", "Data Engineer", "ML Engineer"],
    stats: { avgDays: 30, offerRate: "5%", avgRounds: 4, salaryRange: "30–65 LPA" },
    rounds: [
      { name: "Online Assessment",        type: "OA",        duration: "90 min", desc: "2 coding questions + work simulation / debugging section. Platform: HackerRank." },
      { name: "Technical Phone Screen",   type: "Technical", duration: "60 min", desc: "1 DSA problem + LP questions. Medium difficulty." },
      { name: "Onsite Loop 1",            type: "Technical", duration: "60 min", desc: "DSA problem + 2 LP questions. Expect arrays, trees, graphs." },
      { name: "Onsite Loop 2 (Bar Raiser)", type: "Technical", duration: "60 min", desc: "Harder DSA or LLD. Bar Raiser can veto any hire. Most challenging round." },
    ],
    syllabus: {
      "DSA":              ["Arrays", "Linked Lists", "Trees", "Graphs", "DP", "Sorting"],
      "OOP & LLD":        ["Design patterns", "SOLID principles", "Class design"],
      "Leadership Principles": ["Customer Obsession", "Ownership", "Invent & Simplify", "Dive Deep", "Deliver Results", "Bias for Action"],
      "System Design":    ["REST APIs", "Microservices", "Databases", "Message queues"],
    },
    pyqs: [
      { q: "Two sum — find indices of two numbers that add to a target.",   tag: "Arrays",     difficulty: "Easy",   freq: "Very High" },
      { q: "LRU Cache implementation.",                                     tag: "Design",     difficulty: "Medium", freq: "Very High" },
      { q: "Find the kth largest element in an array.",                    tag: "Heap",       difficulty: "Medium", freq: "High"      },
      { q: "Design Amazon's shopping cart system.",                         tag: "LLD",        difficulty: "Hard",   freq: "High"      },
      { q: "Trapping rain water.",                                         tag: "Arrays",     difficulty: "Hard",   freq: "High"      },
      { q: "Tell me about a time you disagreed with your manager.",        tag: "Behavioral", difficulty: "Medium", freq: "Very High" },
    ],
    tips: [
      "Prepare answers for all 16 Leadership Principles — every round will ask LP questions.",
      "Use STAR format: Situation, Task, Action, Result. Keep stories specific with numbers.",
      "Amazon loves 'Ownership' — talk about times you went beyond your role.",
      "In coding rounds, Amazon values working code over elegant code. Ship it first.",
      "For Bar Raiser rounds: they look for red flags, not just technical skill. Stay calm.",
    ],
    resources: [
      { title: "Amazon LP Question Bank",  type: "Guide"    },
      { title: "Leetcode Amazon Tag",      type: "Practice" },
      { title: "Grokking System Design",   type: "Resource" },
    ],
  },

  microsoft: {
    name: "Microsoft", color: "#00a4ef", logo: "M",
    tagline: "Empower every person — and every interview.",
    package: "35–70 LPA", difficulty: "Hard", rounds: 4, hired: "3,000+/yr", tier: "FAANG",
    about: "Microsoft interviews are structured and fair. The 'As Appropriate' (AA) round is unique — a senior engineer gives the final hire/no-hire verdict. Focus is on DSA, coding clarity, and cultural fit.",
    roles: ["SWE", "SDE Intern", "PM", "Data Scientist", "Cloud Engineer"],
    stats: { avgDays: 35, offerRate: "4%", avgRounds: 4, salaryRange: "35–70 LPA" },
    rounds: [
      { name: "Online Assessment",  type: "OA",        duration: "75 min", desc: "2 coding problems on Codility. Easy–Medium difficulty." },
      { name: "Technical Round 1",  type: "Technical", duration: "60 min", desc: "DSA: arrays, strings, trees. 1–2 problems. Focus on correctness." },
      { name: "Technical Round 2",  type: "Technical", duration: "60 min", desc: "More DSA or LLD. May include system design for senior roles." },
      { name: "AA Round",           type: "Technical", duration: "60 min", desc: "As Appropriate round by senior engineer. Mix of DSA, LLD, behavioral. Final hire decision." },
    ],
    syllabus: {
      "DSA":           ["Arrays", "Trees", "Graphs", "DP", "Recursion", "Backtracking"],
      "OOP":           ["Classes & Objects", "Design Patterns", "SOLID", "Inheritance"],
      "System Design": ["Microservices", "Azure fundamentals", "APIs", "Scalability"],
      "Behavioral":    ["Growth mindset", "Collaboration", "Impact"],
    },
    pyqs: [
      { q: "Reverse a linked list.",                                tag: "Linked List",  difficulty: "Easy",   freq: "Very High" },
      { q: "Find all permutations of a string.",                    tag: "Backtracking", difficulty: "Medium", freq: "High"      },
      { q: "Design a parking lot system.",                          tag: "LLD",          difficulty: "Medium", freq: "High"      },
      { q: "Merge K sorted linked lists.",                          tag: "Heap",         difficulty: "Hard",   freq: "Medium"    },
      { q: "Clone a graph.",                                        tag: "Graphs",       difficulty: "Medium", freq: "High"      },
    ],
    tips: [
      "Microsoft loves clean, object-oriented code. Think in classes and interfaces.",
      "Growth mindset is key — show eagerness to learn and adapt.",
      "The AA round is conversational — treat it like a peer discussion.",
      "Be ready to discuss tradeoffs in your design decisions.",
    ],
    resources: [
      { title: "Leetcode Microsoft Tag",       type: "Practice" },
      { title: "Designing Data-Intensive Apps", type: "Book"    },
      { title: "Microsoft Careers Blog",        type: "Guide"   },
    ],
  },

  flipkart: {
    name: "Flipkart", color: "#FFD600", logo: "F",
    tagline: "India's e-commerce giant — think product, think scale.",
    package: "20–45 LPA", difficulty: "Medium", rounds: 4, hired: "1,200+/yr", tier: "Unicorn",
    about: "Flipkart (Walmart subsidiary) has a rigorous technical process comparable to top product companies. Emphasis on DSA, system design, and product thinking.",
    roles: ["SDE-1", "SDE-2", "SDE Intern", "Product Manager", "Data Scientist"],
    stats: { avgDays: 25, offerRate: "8%", avgRounds: 4, salaryRange: "20–45 LPA" },
    rounds: [
      { name: "Online Assessment",     type: "OA",        duration: "90 min", desc: "2–3 DSA problems on HackerEarth. Medium–Hard. Includes MCQs on CS topics." },
      { name: "Technical Round 1",     type: "Technical", duration: "60 min", desc: "Core DSA: trees, graphs, DP. Clean code expected." },
      { name: "Technical Round 2",     type: "Technical", duration: "60 min", desc: "System Design or LLD depending on experience level." },
      { name: "Hiring Manager Round",  type: "Behavioral", duration: "45 min", desc: "Cultural fit, motivation, past projects, conflict resolution." },
    ],
    syllabus: {
      "DSA":           ["Arrays", "Trees", "Graphs", "DP", "Heap", "Trie"],
      "System Design": ["HLD", "LLD", "Distributed systems", "Scalable APIs"],
      "CS Core":       ["OS", "DBMS", "Networking"],
      "Product":       ["Product metrics", "A/B testing", "User empathy"],
    },
    pyqs: [
      { q: "Maximum profit from stock prices (multiple transactions).",  tag: "DP",           difficulty: "Medium", freq: "High"   },
      { q: "Design Flipkart's product search feature.",                  tag: "System Design", difficulty: "Hard",   freq: "High"   },
      { q: "Find the median of a data stream.",                          tag: "Heap",          difficulty: "Hard",   freq: "High"   },
      { q: "Implement a trie for autocomplete.",                         tag: "Trie",          difficulty: "Hard",   freq: "Medium" },
    ],
    tips: [
      "Flipkart loves systems at scale — always think about millions of users.",
      "LLD round: practice designing systems like Parking Lot, Library, Chess.",
      "Know trade-offs between SQL and NoSQL — a common system design question.",
      "Communication matters — walk the interviewer through your approach step-by-step.",
    ],
    resources: [
      { title: "Leetcode Flipkart Tag",           type: "Practice" },
      { title: "Grokking the System Design",      type: "Resource" },
      { title: "HackerEarth Flipkart Challenges", type: "Practice" },
    ],
  },

  tcs: {
    name: "TCS", color: "#CC0000", logo: "T",
    tagline: "Building on belief — start with the basics.",
    package: "3.3–7 LPA", difficulty: "Easy", rounds: 3, hired: "40,000+/yr", tier: "Service",
    about: "TCS is one of India's largest recruiters. The NQT (National Qualifier Test) is the primary filter. Interviews focus on fundamentals, aptitude, and communication.",
    roles: ["Systems Engineer", "Assistant System Engineer", "Data Analyst", "BPS"],
    stats: { avgDays: 20, offerRate: "30%", avgRounds: 3, salaryRange: "3.3–7 LPA" },
    rounds: [
      { name: "TCS NQT",            type: "OA",        duration: "180 min", desc: "Verbal, Reasoning, Quantitative, Coding (2 problems). Sectional cutoffs apply." },
      { name: "Technical Interview", type: "Technical", duration: "30 min",  desc: "Core CS subjects: OOPs, DBMS, OS, networking basics. Projects from resume." },
      { name: "HR Round",           type: "HR",         duration: "15 min",  desc: "Attitude, relocation flexibility, career goals, salary discussion." },
    ],
    syllabus: {
      "Aptitude":      ["Quantitative", "Logical Reasoning", "Verbal Ability"],
      "Coding":        ["Basic arrays", "String operations", "Pattern programs", "Simple recursion"],
      "CS Basics":     ["OOPs concepts", "DBMS queries", "OS fundamentals", "CN basics"],
      "Communication": ["Self introduction", "Group discussion topics"],
    },
    pyqs: [
      { q: "Reverse a string without using built-in functions.",   tag: "Strings",  difficulty: "Easy", freq: "Very High" },
      { q: "What is normalization? Explain with example.",         tag: "DBMS",     difficulty: "Easy", freq: "Very High" },
      { q: "Write SQL query to find the second highest salary.",   tag: "SQL",      difficulty: "Easy", freq: "Very High" },
      { q: "What is polymorphism? Give a real-world example.",     tag: "OOPs",     difficulty: "Easy", freq: "High"      },
      { q: "A train travels 60 km in 45 min. Find speed in km/h.", tag: "Aptitude", difficulty: "Easy", freq: "Very High" },
    ],
    tips: [
      "Sectional cutoffs in NQT are strict — don't neglect verbal or reasoning sections.",
      "Know your resume projects inside out — every line is a potential question.",
      "Prepare a 2-minute self-introduction — practiced and confident.",
      "TCS values attitude and willingness to learn over technical depth for fresher roles.",
    ],
    resources: [
      { title: "TCS NQT Previous Papers", type: "PYQ"      },
      { title: "IndiaBix Aptitude",        type: "Practice" },
      { title: "GeeksForGeeks TCS Guide",  type: "Guide"    },
    ],
  },

  infosys: {
    name: "Infosys", color: "#007CC5", logo: "I",
    tagline: "Navigate your next — start with Infosys.",
    package: "3.6–8 LPA", difficulty: "Easy", rounds: 3, hired: "25,000+/yr", tier: "Service",
    about: "Infosys hires in large volumes through InfyTQ and campus drives. Tests focus on aptitude, pseudocode, and CS fundamentals. Power Programmer track offers higher packages.",
    roles: ["Systems Engineer", "Power Programmer", "Digital Specialist"],
    stats: { avgDays: 15, offerRate: "40%", avgRounds: 3, salaryRange: "3.6–8 LPA" },
    rounds: [
      { name: "InfyTQ / HackWithInfy", type: "OA",        duration: "150 min", desc: "Aptitude + Pseudocode + Coding section. Power Programmer track for top coders." },
      { name: "Technical Interview",   type: "Technical",  duration: "30 min",  desc: "OOPs, DBMS, project discussion, basic DSA." },
      { name: "HR Interview",          type: "HR",         duration: "15 min",  desc: "Background, attitude, salary, relocation." },
    ],
    syllabus: {
      "Aptitude":   ["Number series", "Data interpretation", "Logical puzzles"],
      "Pseudocode": ["Code tracing", "Output prediction", "Error identification"],
      "CS Core":    ["OOPs", "DBMS", "Networking", "OS"],
      "Coding":     ["Arrays", "Strings", "Basic algorithms"],
    },
    pyqs: [
      { q: "Predict the output: for(i=5; i>0; i--) cout << i;",   tag: "Pseudocode", difficulty: "Easy", freq: "Very High" },
      { q: "What is the difference between primary key and unique key?", tag: "DBMS", difficulty: "Easy", freq: "High"      },
      { q: "Fibonacci series without recursion.",                   tag: "Coding",    difficulty: "Easy", freq: "High"      },
    ],
    tips: [
      "Target the Power Programmer track — it pays 3x more than the regular SE track.",
      "InfyTQ certification gives you a direct fast-track to interviews.",
      "Pseudocode section is unique to Infosys — practice output tracing extensively.",
    ],
    resources: [
      { title: "InfyTQ Portal",              type: "Official" },
      { title: "HackWithInfy Past Problems",  type: "PYQ"     },
      { title: "PrepInsta Infosys Guide",     type: "Guide"   },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC FALLBACK — for any company not in COMPANY_DETAIL
// This will be replaced by a real AI backend call later
// ─────────────────────────────────────────────────────────────────────────────
export function generateGenericDetail(companyName) {
  const n = companyName;
  return {
    name: n, color: "#888", logo: n[0].toUpperCase(),
    tagline: `Your complete preparation guide for ${n}.`,
    package: "Varies", difficulty: "Medium", rounds: 4, hired: "Varies", tier: "Company",
    about: `${n} follows a standard multi-round interview process common to most tech and product companies. The process typically includes an online assessment, technical coding rounds, and a final HR or behavioral interview. Focus on strong fundamentals in DSA and CS subjects.`,
    roles: ["Software Engineer", "Intern", "Analyst", "Associate"],
    stats: { avgDays: 30, offerRate: "Varies", avgRounds: 4, salaryRange: "Varies" },
    rounds: [
      { name: "Online Assessment",   type: "OA",        duration: "60–90 min", desc: "Aptitude, reasoning, or coding problems depending on the role. Typically conducted on HackerRank, Codility, or company's own platform." },
      { name: "Technical Round 1",   type: "Technical", duration: "45–60 min", desc: "Core DSA questions: arrays, strings, linked lists, trees. Focus on clean, correct code with good complexity." },
      { name: "Technical Round 2",   type: "Technical", duration: "45–60 min", desc: "Deeper DSA, system/LLD design, or subject-specific questions depending on role. Resume-based project questions likely." },
      { name: "HR / Managerial",     type: "HR",        duration: "20–30 min", desc: "Cultural fit, career goals, past experiences, salary discussion, and relocation preferences." },
    ],
    syllabus: {
      "DSA":           ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming", "Sorting & Searching"],
      "CS Fundamentals": ["OOPs concepts", "DBMS & SQL", "OS basics", "Computer Networks"],
      "Aptitude":      ["Quantitative reasoning", "Logical reasoning", "Verbal ability"],
      "Behavioral":    ["STAR format answers", "Team collaboration", "Problem-solving stories"],
    },
    pyqs: [
      { q: "Find the second largest element in an array.",          tag: "Arrays",  difficulty: "Easy",   freq: "High"      },
      { q: "Reverse a linked list.",                                tag: "Linked List", difficulty: "Easy", freq: "Very High" },
      { q: "Explain the difference between process and thread.",   tag: "OS",      difficulty: "Easy",   freq: "High"      },
      { q: "Write a SQL query to find employees with salary > 50000.", tag: "SQL", difficulty: "Easy",   freq: "High"      },
      { q: "What is polymorphism? Give an example.",               tag: "OOPs",    difficulty: "Easy",   freq: "High"      },
      { q: "Find the shortest path in an unweighted graph.",       tag: "Graphs",  difficulty: "Medium", freq: "Medium"    },
    ],
    tips: [
      `Research ${n}'s products and tech stack before the interview — show genuine interest.`,
      "Prepare a strong 2-minute self-introduction covering education, projects, and goals.",
      "Practice DSA problems on LeetCode or HackerRank — focus on Easy and Medium.",
      "Know your resume inside out — every project and skill will be questioned.",
      "In technical rounds, think aloud and explain your approach before coding.",
      "For HR rounds, prepare STAR format answers about teamwork, challenges, and achievements.",
    ],
    resources: [
      { title: `${n} Interview Experiences (GeeksForGeeks)`, type: "Guide"    },
      { title: "LeetCode Practice",                           type: "Practice" },
      { title: "IndiaBix Aptitude",                           type: "Practice" },
      { title: "Cracking the Coding Interview",               type: "Book"     },
    ],
  };
}

export function getCompanyDetail(id) {
  return COMPANY_DETAIL[id.toLowerCase()] || null;
}

// Popular companies shown as search suggestions
export const POPULAR_COMPANIES = [
  { id: "google",    name: "Google",    color: "#4285F4", logo: "G" },
  { id: "amazon",    name: "Amazon",    color: "#FF9900", logo: "A" },
  { id: "microsoft", name: "Microsoft", color: "#00a4ef", logo: "M" },
  { id: "flipkart",  name: "Flipkart",  color: "#FFD600", logo: "F" },
  { id: "tcs",       name: "TCS",       color: "#CC0000", logo: "T" },
  { id: "infosys",   name: "Infosys",   color: "#007CC5", logo: "I" },
  { id: "wipro",     name: "Wipro",     color: "#5F259F", logo: "W" },
  { id: "adobe",     name: "Adobe",     color: "#FF0000", logo: "A" },
  { id: "oracle",    name: "Oracle",    color: "#F80000", logo: "O" },
  { id: "meta",      name: "Meta",      color: "#1877F2", logo: "M" },
  { id: "swiggy",    name: "Swiggy",    color: "#FC8019", logo: "S" },
  { id: "zomato",    name: "Zomato",    color: "#E23744", logo: "Z" },
  { id: "paytm",     name: "Paytm",     color: "#00BAF2", logo: "P" },
  { id: "phonepe",   name: "PhonePe",   color: "#5F259F", logo: "P" },
  { id: "byju",      name: "BYJU'S",    color: "#2496ED", logo: "B" },
  { id: "deloitte",  name: "Deloitte",  color: "#86BC25", logo: "D" },
  { id: "capgemini", name: "Capgemini", color: "#0070AD", logo: "C" },
  { id: "accenture", name: "Accenture", color: "#A100FF", logo: "A" },
  { id: "cognizant",  name: "Cognizant",  color: "#1080b4", logo: "C" },
];

export const diffColor = { Easy: "#1dd1a1", Medium: "#ff9f43", Hard: "#ff6b6b" };
export const freqColor = { "Very High": "#ff6b6b", "High": "#ff9f43", "Medium": "#FFD600" };
export const typeColor = { OA: "#54a0ff", Technical: "#FFD600", HR: "#1dd1a1", Behavioral: "#ff9f43" };