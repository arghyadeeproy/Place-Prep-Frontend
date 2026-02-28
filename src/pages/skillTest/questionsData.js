// ─────────────────────────────────────────────────────────────
// QUESTIONS — replace with API call later
// ─────────────────────────────────────────────────────────────
export const ALL_QUESTIONS = [
  {
    id: 1, tag: "DSA", difficulty: "Medium",
    question: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1,
    explanation: "Binary search halves the search space at each step, giving O(log n) time complexity."
  },
  {
    id: 2, tag: "DSA", difficulty: "Hard",
    question: "Which data structure is used in BFS traversal of a graph?",
    options: ["Stack", "Queue", "Priority Queue", "Deque"],
    answer: 1,
    explanation: "BFS uses a Queue (FIFO) to explore nodes level by level."
  },
  {
    id: 3, tag: "DSA", difficulty: "Easy",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    answer: 1,
    explanation: "QuickSort's worst case is O(n²) when the pivot is always the smallest or largest element."
  },
  {
    id: 4, tag: "DSA", difficulty: "Medium",
    question: "Which of the following traversals of a binary tree visits the root node last?",
    options: ["Inorder", "Preorder", "Postorder", "Level Order"],
    answer: 2,
    explanation: "Postorder traversal: Left → Right → Root. The root is visited last."
  },
  {
    id: 5, tag: "OS", difficulty: "Medium",
    question: "Which page replacement algorithm suffers from Belady's Anomaly?",
    options: ["LRU", "Optimal", "FIFO", "LFU"],
    answer: 2,
    explanation: "FIFO can suffer from Belady's Anomaly — increasing frames can actually increase page faults."
  },
  {
    id: 6, tag: "OS", difficulty: "Hard",
    question: "In a system with 3 processes and 4 resources of the same type, deadlock is:",
    options: ["Always possible", "Never possible", "Possible only with circular wait", "Impossible if resources > processes"],
    answer: 1,
    explanation: "If total resources (4) > total processes (3), at least one process can always proceed, preventing deadlock."
  },
  {
    id: 7, tag: "OS", difficulty: "Easy",
    question: "What does CPU scheduling algorithm 'Round Robin' use to allocate time?",
    options: ["Priority", "Time Quantum", "Burst Time", "Arrival Time"],
    answer: 1,
    explanation: "Round Robin uses a fixed Time Quantum to allocate CPU time to each process in a cyclic order."
  },
  {
    id: 8, tag: "DBMS", difficulty: "Medium",
    question: "Which normal form eliminates transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: 2,
    explanation: "3NF removes transitive dependencies — non-key attributes must depend only on the primary key."
  },
  {
    id: 9, tag: "DBMS", difficulty: "Easy",
    question: "Which SQL clause is used to filter groups in a GROUP BY query?",
    options: ["WHERE", "HAVING", "FILTER", "GROUP FILTER"],
    answer: 1,
    explanation: "HAVING filters groups after GROUP BY. WHERE filters individual rows before grouping."
  },
  {
    id: 10, tag: "DBMS", difficulty: "Hard",
    question: "ACID properties in a database — what does 'I' stand for?",
    options: ["Integration", "Integrity", "Isolation", "Indexing"],
    answer: 2,
    explanation: "I stands for Isolation — concurrent transactions should not interfere with each other."
  },
  {
    id: 11, tag: "CN", difficulty: "Medium",
    question: "Which OSI layer is responsible for routing packets across networks?",
    options: ["Data Link Layer", "Transport Layer", "Network Layer", "Session Layer"],
    answer: 2,
    explanation: "The Network Layer (Layer 3) handles logical addressing and routing using protocols like IP."
  },
  {
    id: 12, tag: "CN", difficulty: "Easy",
    question: "What does DNS stand for?",
    options: ["Data Network System", "Domain Name System", "Dynamic Name Server", "Distributed Network Service"],
    answer: 1,
    explanation: "DNS — Domain Name System — translates human-readable domain names to IP addresses."
  },
  {
    id: 13, tag: "CN", difficulty: "Hard",
    question: "Which TCP/IP congestion control algorithm starts with exponential growth?",
    options: ["Congestion Avoidance", "Slow Start", "Fast Retransmit", "Fast Recovery"],
    answer: 1,
    explanation: "Slow Start begins with a small congestion window that grows exponentially until it hits the ssthresh."
  },
  {
    id: 14, tag: "OOPs", difficulty: "Easy",
    question: "Which OOP principle hides implementation details and exposes only the interface?",
    options: ["Inheritance", "Polymorphism", "Abstraction", "Encapsulation"],
    answer: 2,
    explanation: "Abstraction hides internal complexity and shows only essential features to the user."
  },
  {
    id: 15, tag: "OOPs", difficulty: "Medium",
    question: "What is method overriding in OOP?",
    options: [
      "Defining two methods with same name but different parameters",
      "Redefining a parent class method in a child class",
      "Using a method from another class",
      "Calling a method multiple times"
    ],
    answer: 1,
    explanation: "Method overriding allows a subclass to provide a specific implementation of a method already defined in the parent."
  },
  {
    id: 16, tag: "OOPs", difficulty: "Hard",
    question: "Which design pattern ensures a class has only one instance?",
    options: ["Factory", "Observer", "Singleton", "Strategy"],
    answer: 2,
    explanation: "The Singleton pattern restricts instantiation to one object and provides a global access point."
  },
  {
    id: 17, tag: "Aptitude", difficulty: "Easy",
    question: "If a train travels 60 km in 45 minutes, what is its speed in km/h?",
    options: ["80 km/h", "75 km/h", "90 km/h", "70 km/h"],
    answer: 0,
    explanation: "Speed = 60 ÷ (45/60) = 60 × (4/3) = 80 km/h."
  },
  {
    id: 18, tag: "Aptitude", difficulty: "Medium",
    question: "In how many ways can 4 people be seated in a row of 6 seats?",
    options: ["360", "720", "120", "24"],
    answer: 0,
    explanation: "P(6,4) = 6 × 5 × 4 × 3 = 360 ways."
  },
  {
    id: 19, tag: "DSA", difficulty: "Hard",
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 2,
    explanation: "Merge Sort requires O(n) auxiliary space for temporary arrays used during merging."
  },
  {
    id: 20, tag: "DBMS", difficulty: "Medium",
    question: "Which JOIN returns all rows from both tables, with NULLs where there is no match?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    answer: 3,
    explanation: "FULL OUTER JOIN returns all rows from both tables; unmatched rows get NULL values."
  },
];

// ─────────────────────────────────────────────────────────────
// TEST DEFINITIONS
// ─────────────────────────────────────────────────────────────
export const TESTS = [
  { id: "dsa-mock",  title: "DSA Mock Test #5",  questions: 5, time: 10, difficulty: "Hard",   tag: "DSA",      color: "#FFD600", qIds: [1,2,3,4,19] },
  { id: "dbms-quiz", title: "DBMS Quiz",          questions: 4, time: 8,  difficulty: "Medium", tag: "DBMS",     color: "#ff9f43", qIds: [8,9,10,20] },
  { id: "os-test",   title: "OS Concepts Test",   questions: 3, time: 6,  difficulty: "Medium", tag: "OS",       color: "#54a0ff", qIds: [5,6,7] },
  { id: "aptitude",  title: "Aptitude Round",     questions: 2, time: 5,  difficulty: "Easy",   tag: "Aptitude", color: "#1dd1a1", qIds: [17,18] },
  { id: "cn-test",   title: "CN Fundamentals",    questions: 3, time: 6,  difficulty: "Hard",   tag: "CN",       color: "#00d2d3", qIds: [11,12,13] },
  { id: "oops-test", title: "OOPs in Java",       questions: 3, time: 5,  difficulty: "Easy",   tag: "OOPs",     color: "#ff6b81", qIds: [14,15,16] },
];

export const diffColor = { Easy: "#1dd1a1", Medium: "#ff9f43", Hard: "#ff6b6b" };