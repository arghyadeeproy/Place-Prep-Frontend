export const SUBJECTS = [
  { id: "dsa",  name: "Data Structures & Algorithms", short: "DSA",  icon: "🌲", color: "#FFD600", progress: 68, desc: "Arrays, Linked Lists, Trees, Graphs, DP, Sorting" },
  { id: "dbms", name: "Database Management System",   short: "DBMS", icon: "🗄️", color: "#ff9f43", progress: 52, desc: "SQL, Normalization, Transactions, Indexing" },
  { id: "os",   name: "Operating System",             short: "OS",   icon: "⚙️", color: "#54a0ff", progress: 74, desc: "Processes, Threads, Memory Management, Scheduling" },
  { id: "cn",   name: "Computer Networks",            short: "CN",   icon: "🌐", color: "#00d2d3", progress: 40, desc: "OSI Model, TCP/IP, DNS, HTTP, Routing" },
  { id: "oops", name: "Object Oriented Programming",  short: "OOPs", icon: "🧩", color: "#ff6b81", progress: 90, desc: "Classes, Inheritance, Polymorphism, Abstraction" },
  { id: "sql",  name: "SQL & Databases",              short: "SQL",  icon: "📊", color: "#1dd1a1", progress: 61, desc: "Queries, Joins, Aggregation, Stored Procedures" },
];

export const MODULES = {
  dsa: [
    { id: "arrays",     title: "Arrays & Strings",      icon: "📦", lessons: 6, done: 6, difficulty: "Easy" },
    { id: "linked",     title: "Linked Lists",           icon: "🔗", lessons: 5, done: 5, difficulty: "Easy" },
    { id: "stacks",     title: "Stacks & Queues",        icon: "🥞", lessons: 4, done: 4, difficulty: "Easy" },
    { id: "trees",      title: "Trees & BST",            icon: "🌳", lessons: 8, done: 5, difficulty: "Medium" },
    { id: "graphs",     title: "Graphs & BFS/DFS",       icon: "🕸️", lessons: 7, done: 3, difficulty: "Hard" },
    { id: "dp",         title: "Dynamic Programming",    icon: "🧮", lessons: 10, done: 2, difficulty: "Hard" },
    { id: "sorting",    title: "Sorting Algorithms",     icon: "🔀", lessons: 5, done: 5, difficulty: "Medium" },
    { id: "searching",  title: "Searching & Binary Search", icon: "🔍", lessons: 4, done: 4, difficulty: "Easy" },
  ],
  dbms: [
    { id: "intro",      title: "Intro to DBMS",          icon: "📖", lessons: 4, done: 4, difficulty: "Easy" },
    { id: "er",         title: "ER Model & Diagrams",     icon: "📐", lessons: 5, done: 3, difficulty: "Medium" },
    { id: "relational", title: "Relational Model",        icon: "🔗", lessons: 6, done: 3, difficulty: "Medium" },
    { id: "normalization", title: "Normalization (1NF–BCNF)", icon: "🧹", lessons: 7, done: 2, difficulty: "Hard" },
    { id: "transactions", title: "Transactions & ACID",   icon: "💳", lessons: 5, done: 1, difficulty: "Hard" },
    { id: "indexing",   title: "Indexing & B-Trees",      icon: "📇", lessons: 4, done: 1, difficulty: "Medium" },
  ],
  os: [
    { id: "intro",      title: "OS Overview & Types",    icon: "🖥️", lessons: 4, done: 4, difficulty: "Easy" },
    { id: "process",    title: "Processes & Threads",     icon: "⚙️", lessons: 6, done: 5, difficulty: "Medium" },
    { id: "scheduling", title: "CPU Scheduling",          icon: "📅", lessons: 6, done: 4, difficulty: "Medium" },
    { id: "memory",     title: "Memory Management",       icon: "🧠", lessons: 7, done: 3, difficulty: "Hard" },
    { id: "deadlock",   title: "Deadlocks",               icon: "🔒", lessons: 5, done: 2, difficulty: "Hard" },
    { id: "filesystem", title: "File Systems",            icon: "📁", lessons: 4, done: 0, difficulty: "Medium" },
  ],
  cn: [
    { id: "osi",        title: "OSI & TCP/IP Model",     icon: "📡", lessons: 6, done: 3, difficulty: "Medium" },
    { id: "physical",   title: "Physical & Data Link",   icon: "🔌", lessons: 5, done: 2, difficulty: "Easy" },
    { id: "network",    title: "Network Layer & IP",     icon: "🌐", lessons: 6, done: 1, difficulty: "Medium" },
    { id: "transport",  title: "Transport Layer (TCP/UDP)", icon: "🚚", lessons: 5, done: 1, difficulty: "Hard" },
    { id: "application", title: "Application Layer (HTTP, DNS)", icon: "🌍", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "security",   title: "Network Security",       icon: "🛡️", lessons: 4, done: 0, difficulty: "Hard" },
  ],
  oops: [
    { id: "basics",     title: "Classes & Objects",      icon: "🏗️", lessons: 5, done: 5, difficulty: "Easy" },
    { id: "encap",      title: "Encapsulation",          icon: "📦", lessons: 4, done: 4, difficulty: "Easy" },
    { id: "inherit",    title: "Inheritance",            icon: "🧬", lessons: 6, done: 6, difficulty: "Medium" },
    { id: "poly",       title: "Polymorphism",           icon: "🎭", lessons: 5, done: 5, difficulty: "Medium" },
    { id: "abstract",   title: "Abstraction & Interfaces", icon: "🎨", lessons: 4, done: 4, difficulty: "Medium" },
    { id: "patterns",   title: "Design Patterns",        icon: "♟️", lessons: 8, done: 3, difficulty: "Hard" },
  ],
  sql: [
    { id: "basics",     title: "SQL Basics & DDL",       icon: "🛠️", lessons: 5, done: 4, difficulty: "Easy" },
    { id: "dml",        title: "DML — SELECT, INSERT, UPDATE", icon: "✏️", lessons: 6, done: 4, difficulty: "Easy" },
    { id: "joins",      title: "Joins & Subqueries",     icon: "🔗", lessons: 7, done: 3, difficulty: "Medium" },
    { id: "aggregation", title: "Aggregation & GROUP BY", icon: "📊", lessons: 5, done: 2, difficulty: "Medium" },
    { id: "advanced",   title: "Views, Indexes, Triggers", icon: "⚡", lessons: 6, done: 1, difficulty: "Hard" },
    { id: "stored",     title: "Stored Procedures & Functions", icon: "🔧", lessons: 4, done: 0, difficulty: "Hard" },
  ],
};

export const LESSONS = {
  // DSA — Arrays
  "dsa-arrays": [
    { id: 1, title: "Introduction to Arrays",           type: "theory",   done: true },
    { id: 2, title: "Array Traversal & Searching",      type: "theory",   done: true },
    { id: 3, title: "Two Pointer Technique",            type: "theory",   done: true },
    { id: 4, title: "Sliding Window Pattern",           type: "theory",   done: true },
    { id: 5, title: "Practice: Subarray Problems",      type: "practice", done: true },
    { id: 6, title: "Practice: Two Sum & Variations",   type: "practice", done: true },
  ],
  // DSA — Trees
  "dsa-trees": [
    { id: 1, title: "Binary Tree Basics",               type: "theory",   done: true },
    { id: 2, title: "Tree Traversals (In/Pre/Post)",    type: "theory",   done: true },
    { id: 3, title: "Binary Search Tree",               type: "theory",   done: true },
    { id: 4, title: "Height & Diameter of Tree",        type: "theory",   done: true },
    { id: 5, title: "AVL Trees & Rotations",            type: "theory",   done: true },
    { id: 6, title: "Practice: BST Operations",         type: "practice", done: false },
    { id: 7, title: "Practice: Level Order Problems",   type: "practice", done: false },
    { id: 8, title: "Practice: Path Sum Problems",      type: "practice", done: false },
  ],
  // DSA — Graphs
  "dsa-graphs": [
    { id: 1, title: "Graph Representation",             type: "theory",   done: true },
    { id: 2, title: "BFS — Breadth First Search",       type: "theory",   done: true },
    { id: 3, title: "DFS — Depth First Search",         type: "theory",   done: true },
    { id: 4, title: "Shortest Path — Dijkstra",         type: "theory",   done: false },
    { id: 5, title: "Cycle Detection",                  type: "theory",   done: false },
    { id: 6, title: "Topological Sort",                 type: "theory",   done: false },
    { id: 7, title: "Practice: BFS/DFS Problems",       type: "practice", done: false },
  ],
  // DSA — DP
  "dsa-dp": [
    { id: 1, title: "What is Dynamic Programming?",     type: "theory",   done: true },
    { id: 2, title: "Memoization vs Tabulation",        type: "theory",   done: true },
    { id: 3, title: "0/1 Knapsack",                     type: "theory",   done: false },
    { id: 4, title: "Longest Common Subsequence",       type: "theory",   done: false },
    { id: 5, title: "Matrix Chain Multiplication",      type: "theory",   done: false },
    { id: 6, title: "Coin Change Problem",              type: "theory",   done: false },
    { id: 7, title: "Practice: Classic DP Problems",   type: "practice", done: false },
    { id: 8, title: "Practice: Interview DP Patterns", type: "practice", done: false },
    { id: 9, title: "Practice: String DP",             type: "practice", done: false },
    { id: 10, title: "Practice: Grid DP",              type: "practice", done: false },
  ],
  // OS — Process
  "os-process": [
    { id: 1, title: "Process vs Thread",                type: "theory",   done: true },
    { id: 2, title: "Process States & PCB",             type: "theory",   done: true },
    { id: 3, title: "Context Switching",                type: "theory",   done: true },
    { id: 4, title: "Thread Types & Multithreading",    type: "theory",   done: true },
    { id: 5, title: "Inter-Process Communication",      type: "theory",   done: true },
    { id: 6, title: "Practice Questions",               type: "practice", done: false },
  ],
  // DBMS — Normalization
  "dbms-normalization": [
    { id: 1, title: "Functional Dependencies",          type: "theory",   done: true },
    { id: 2, title: "First Normal Form (1NF)",          type: "theory",   done: true },
    { id: 3, title: "Second Normal Form (2NF)",         type: "theory",   done: false },
    { id: 4, title: "Third Normal Form (3NF)",          type: "theory",   done: false },
    { id: 5, title: "Boyce-Codd Normal Form (BCNF)",    type: "theory",   done: false },
    { id: 6, title: "Decomposition & Lossless Join",    type: "theory",   done: false },
    { id: 7, title: "Practice: Normalize this Schema",  type: "practice", done: false },
  ],
};

// Get lessons for a module (fallback to generated ones)
export function getLessons(subjectId, moduleId) {
  const key = `${subjectId}-${moduleId}`;
  if (LESSONS[key]) return LESSONS[key];
  const mod = (MODULES[subjectId] || []).find(m => m.id === moduleId);
  if (!mod) return [];
  return Array.from({ length: mod.lessons }, (_, i) => ({
    id: i + 1,
    title: `Lesson ${i + 1}: ${mod.title}`,
    type: i >= mod.lessons - 2 ? "practice" : "theory",
    done: i < mod.done,
  }));
}

export const diffColor = { Easy: "#1dd1a1", Medium: "#ff9f43", Hard: "#ff6b6b" };