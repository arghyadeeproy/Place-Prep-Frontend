export const SUBJECTS = [
  // ── Original 6 ──────────────────────────────────────────────
  { id: "dsa",           name: "Data Structures & Algorithms", short: "DSA",    icon: "🌲", color: "#FFD600", progress: 0, desc: "Arrays, Linked Lists, Trees, Graphs, DP, Sorting" },
  { id: "dbms",          name: "Database Management System",   short: "DBMS",   icon: "🗄️", color: "#ff9f43", progress: 0, desc: "SQL, Normalization, Transactions, Indexing" },
  { id: "os",            name: "Operating System",             short: "OS",     icon: "⚙️", color: "#54a0ff", progress: 0, desc: "Processes, Threads, Memory Management, Scheduling" },
  { id: "cn",            name: "Computer Networks",            short: "CN",     icon: "🌐", color: "#00d2d3", progress: 0, desc: "OSI Model, TCP/IP, DNS, HTTP, Routing" },
  { id: "oops",          name: "Object Oriented Programming",  short: "OOPs",   icon: "🧩", color: "#ff6b81", progress: 0, desc: "Classes, Inheritance, Polymorphism, Abstraction" },
  { id: "sql",           name: "SQL & Databases",              short: "SQL",    icon: "📊", color: "#1dd1a1", progress: 0, desc: "Queries, Joins, Aggregation, Stored Procedures" },

  // ── New 8 ────────────────────────────────────────────────────
  { id: "system-design", name: "System Design",                short: "SD",     icon: "🏛️", color: "#a29bfe", progress: 0, desc: "Scalability, Load Balancing, Microservices, HLD" },
  { id: "lld",           name: "Low Level Design",             short: "LLD",    icon: "🔩", color: "#fd79a8", progress: 0, desc: "SOLID, Design Patterns, UML, Object Modelling" },
  { id: "python",        name: "Python",                       short: "PY",     icon: "🐍", color: "#55efc4", progress: 0, desc: "Syntax, OOP, Decorators, Async, Data Structures" },
  { id: "java",          name: "Java",                         short: "Java",   icon: "☕", color: "#e17055", progress: 0, desc: "JVM, Collections, Streams, Generics, Concurrency" },
  { id: "cpp",           name: "C++",                          short: "C++",    icon: "⚡", color: "#74b9ff", progress: 0, desc: "Pointers, STL, Templates, Memory Management, RAII" },
  { id: "c",             name: "C Programming",                short: "C",      icon: "🔤", color: "#b2bec3", progress: 0, desc: "Pointers, Structs, Dynamic Memory, File I/O" },
  { id: "cloud",         name: "Cloud Computing",              short: "Cloud",  icon: "☁️", color: "#0984e3", progress: 0, desc: "AWS, Networking, Containers, Serverless, DevOps" },
  { id: "ml",            name: "Basic Machine Learning",       short: "ML",     icon: "🤖", color: "#6c5ce7", progress: 0, desc: "Regression, Classification, Clustering, Neural Nets" },
];

export const MODULES = {
  dsa: [
    { id: "arrays",     title: "Arrays & Strings",           icon: "📦", lessons: 6,  done: 0, difficulty: "Easy"   },
    { id: "linked",     title: "Linked Lists",               icon: "🔗", lessons: 5,  done: 0, difficulty: "Easy"   },
    { id: "stacks",     title: "Stacks & Queues",            icon: "🥞", lessons: 4,  done: 0, difficulty: "Easy"   },
    { id: "trees",      title: "Trees & BST",                icon: "🌳", lessons: 8,  done: 0, difficulty: "Medium" },
    { id: "graphs",     title: "Graphs & BFS/DFS",           icon: "🕸️", lessons: 7,  done: 0, difficulty: "Hard"   },
    { id: "dp",         title: "Dynamic Programming",        icon: "🧮", lessons: 10, done: 0, difficulty: "Hard"   },
    { id: "sorting",    title: "Sorting Algorithms",         icon: "🔀", lessons: 5,  done: 0, difficulty: "Medium" },
    { id: "searching",  title: "Searching & Binary Search",  icon: "🔍", lessons: 4,  done: 0, difficulty: "Easy"   },
  ],
  dbms: [
    { id: "intro",         title: "Intro to DBMS",           icon: "📖", lessons: 4, done: 0, difficulty: "Easy"   },
    { id: "er",            title: "ER Model & Diagrams",     icon: "📐", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "relational",    title: "Relational Model",        icon: "🔗", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "normalization", title: "Normalization (1NF–BCNF)",icon: "🧹", lessons: 7, done: 0, difficulty: "Hard"   },
    { id: "transactions",  title: "Transactions & ACID",     icon: "💳", lessons: 5, done: 0, difficulty: "Hard"   },
    { id: "indexing",      title: "Indexing & B-Trees",      icon: "📇", lessons: 4, done: 0, difficulty: "Medium" },
  ],
  os: [
    { id: "intro",      title: "OS Overview & Types",        icon: "🖥️", lessons: 4, done: 0, difficulty: "Easy"   },
    { id: "process",    title: "Processes & Threads",        icon: "⚙️", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "scheduling", title: "CPU Scheduling",             icon: "📅", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "memory",     title: "Memory Management",          icon: "🧠", lessons: 7, done: 0, difficulty: "Hard"   },
    { id: "deadlock",   title: "Deadlocks",                  icon: "🔒", lessons: 5, done: 0, difficulty: "Hard"   },
    { id: "filesystem", title: "File Systems",               icon: "📁", lessons: 4, done: 0, difficulty: "Medium" },
  ],
  cn: [
    { id: "osi",         title: "OSI & TCP/IP Model",        icon: "📡", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "physical",    title: "Physical & Data Link",      icon: "🔌", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "network",     title: "Network Layer & IP",        icon: "🌐", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "transport",   title: "Transport Layer (TCP/UDP)", icon: "🚚", lessons: 5, done: 0, difficulty: "Hard"   },
    { id: "application", title: "Application Layer (HTTP, DNS)", icon: "🌍", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "security",    title: "Network Security",          icon: "🛡️", lessons: 4, done: 0, difficulty: "Hard"   },
  ],
  oops: [
    { id: "basics",   title: "Classes & Objects",            icon: "🏗️", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "encap",    title: "Encapsulation",                icon: "📦", lessons: 4, done: 0, difficulty: "Easy"   },
    { id: "inherit",  title: "Inheritance",                  icon: "🧬", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "poly",     title: "Polymorphism",                 icon: "🎭", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "abstract", title: "Abstraction & Interfaces",     icon: "🎨", lessons: 4, done: 0, difficulty: "Medium" },
    { id: "patterns", title: "Design Patterns",              icon: "♟️", lessons: 8, done: 0, difficulty: "Hard"   },
  ],
  sql: [
    { id: "basics",      title: "SQL Basics & DDL",          icon: "🛠️", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "dml",         title: "DML — SELECT, INSERT, UPDATE", icon: "✏️", lessons: 6, done: 0, difficulty: "Easy" },
    { id: "joins",       title: "Joins & Subqueries",        icon: "🔗", lessons: 7, done: 0, difficulty: "Medium" },
    { id: "aggregation", title: "Aggregation & GROUP BY",    icon: "📊", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "advanced",    title: "Views, Indexes, Triggers",  icon: "⚡", lessons: 6, done: 0, difficulty: "Hard"   },
    { id: "stored",      title: "Stored Procedures & Functions", icon: "🔧", lessons: 4, done: 0, difficulty: "Hard" },
  ],
  "system-design": [
    { id: "scalability",    title: "Scalability Basics",          icon: "📈", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "load-balancing", title: "Load Balancing & Caching",    icon: "⚖️", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "databases",      title: "Databases at Scale",          icon: "🗄️", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "microservices",  title: "Microservices Architecture",  icon: "🔧", lessons: 7, done: 0, difficulty: "Hard"   },
    { id: "cap-theorem",    title: "CAP Theorem & Consistency",   icon: "📐", lessons: 5, done: 0, difficulty: "Hard"   },
    { id: "message-queues", title: "Message Queues & Kafka",      icon: "📨", lessons: 5, done: 0, difficulty: "Hard"   },
    { id: "url-shortener",  title: "Design URL Shortener",        icon: "🔗", lessons: 4, done: 0, difficulty: "Medium" },
    { id: "twitter",        title: "Design Twitter / Instagram",  icon: "🐦", lessons: 5, done: 0, difficulty: "Hard"   },
  ],
  lld: [
    { id: "solid",          title: "SOLID Principles",            icon: "🧱", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "uml",            title: "UML & Class Diagrams",        icon: "📊", lessons: 4, done: 0, difficulty: "Easy"   },
    { id: "creational",     title: "Creational Design Patterns",  icon: "🏗️", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "structural",     title: "Structural Design Patterns",  icon: "🔩", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "behavioral",     title: "Behavioral Design Patterns",  icon: "🎭", lessons: 7, done: 0, difficulty: "Hard"   },
    { id: "parking-lot",    title: "Design Parking Lot System",   icon: "🚗", lessons: 4, done: 0, difficulty: "Medium" },
    { id: "booking-system", title: "Design Booking System",       icon: "🎟️", lessons: 5, done: 0, difficulty: "Hard"   },
  ],
  python: [
    { id: "basics",      title: "Python Basics & Syntax",         icon: "🐍", lessons: 6, done: 0, difficulty: "Easy"   },
    { id: "data-types",  title: "Data Types & Collections",       icon: "📦", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "functions",   title: "Functions & Lambdas",            icon: "⚡", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "oop",         title: "OOP in Python",                  icon: "🧩", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "decorators",  title: "Decorators & Generators",        icon: "🎨", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "concurrency", title: "Multithreading & Async",         icon: "🔄", lessons: 6, done: 0, difficulty: "Hard"   },
    { id: "file-io",     title: "File I/O & Exception Handling",  icon: "📁", lessons: 4, done: 0, difficulty: "Easy"   },
  ],
  java: [
    { id: "basics",      title: "Java Basics & JVM",              icon: "☕", lessons: 6, done: 0, difficulty: "Easy"   },
    { id: "oop",         title: "OOP in Java",                    icon: "🧩", lessons: 6, done: 0, difficulty: "Easy"   },
    { id: "collections", title: "Collections Framework",          icon: "📦", lessons: 7, done: 0, difficulty: "Medium" },
    { id: "generics",    title: "Generics & Wildcards",           icon: "🔣", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "streams",     title: "Streams & Lambda (Java 8+)",     icon: "🌊", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "concurrency", title: "Multithreading & Concurrency",   icon: "🔄", lessons: 7, done: 0, difficulty: "Hard"   },
    { id: "exception",   title: "Exception Handling & I/O",       icon: "⚠️", lessons: 4, done: 0, difficulty: "Easy"   },
  ],
  cpp: [
    { id: "basics",      title: "C++ Basics & Syntax",            icon: "⚙️", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "pointers",    title: "Pointers & References",          icon: "👉", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "oop",         title: "OOP in C++",                     icon: "🧩", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "stl",         title: "STL — Vectors, Maps, Sets",      icon: "📚", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "templates",   title: "Templates & Generic Prog.",      icon: "🔣", lessons: 5, done: 0, difficulty: "Hard"   },
    { id: "memory",      title: "Memory Management & RAII",       icon: "🧠", lessons: 6, done: 0, difficulty: "Hard"   },
    { id: "modern-cpp",  title: "Modern C++ (11/14/17)",          icon: "🚀", lessons: 6, done: 0, difficulty: "Hard"   },
  ],
  c: [
    { id: "basics",    title: "C Basics & Syntax",                icon: "🔤", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "pointers",  title: "Pointers & Arrays",                icon: "👉", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "functions", title: "Functions & Recursion",            icon: "🔁", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "structs",   title: "Structs & Unions",                 icon: "🏗️", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "memory",    title: "Dynamic Memory (malloc/free)",     icon: "🧠", lessons: 5, done: 0, difficulty: "Hard"   },
    { id: "file-io",   title: "File I/O & Preprocessors",        icon: "📁", lessons: 4, done: 0, difficulty: "Medium" },
  ],
  cloud: [
    { id: "intro",        title: "Cloud Fundamentals & Models",   icon: "☁️", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "aws-core",     title: "AWS Core Services",             icon: "🟠", lessons: 7, done: 0, difficulty: "Medium" },
    { id: "networking",   title: "Cloud Networking & VPC",        icon: "🌐", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "storage",      title: "Storage & Databases in Cloud",  icon: "🗄️", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "containers",   title: "Containers & Kubernetes",       icon: "🐳", lessons: 7, done: 0, difficulty: "Hard"   },
    { id: "serverless",   title: "Serverless & Lambda",           icon: "⚡", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "devops",       title: "CI/CD & DevOps Practices",      icon: "🔄", lessons: 6, done: 0, difficulty: "Hard"   },
  ],
  ml: [
    { id: "intro",          title: "ML Fundamentals & Types",        icon: "🤖", lessons: 5, done: 0, difficulty: "Easy"   },
    { id: "regression",     title: "Linear & Logistic Regression",   icon: "📈", lessons: 6, done: 0, difficulty: "Easy"   },
    { id: "classification", title: "Classification Algorithms",      icon: "🏷️", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "clustering",     title: "Clustering (K-Means, DBSCAN)",   icon: "🔵", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "trees",          title: "Decision Trees & Random Forest", icon: "🌳", lessons: 6, done: 0, difficulty: "Medium" },
    { id: "evaluation",     title: "Model Evaluation & Metrics",     icon: "📊", lessons: 5, done: 0, difficulty: "Medium" },
    { id: "neural-nets",    title: "Intro to Neural Networks",       icon: "🧠", lessons: 7, done: 0, difficulty: "Hard"   },
    { id: "feature-eng",    title: "Feature Engineering",            icon: "🔧", lessons: 5, done: 0, difficulty: "Hard"   },
  ],
};

export const LESSONS = {};

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