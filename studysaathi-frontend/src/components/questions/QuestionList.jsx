import { useState } from 'react';
import QuestionCard from './QuestionCard';

const mockQuestions = [
  {
    id: 1,
    title: "How to implement Binary Search Tree in C++? Need help with insertion and deletion operations.",
    content: "I'm struggling to understand the recursive approach for BST insertion. Can someone explain with an example?",
    author: { full_name: "Aarav Sharma" },
    faculty: "CSIT",
    semester: "3",
    tags: ["DSA", "C++", "Trees", "Algorithms"],
    upvotes: 24,
    answers_count: 5,
    views: 156,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    has_accepted_answer: true,
  },
  {
    id: 2,
    title: "Explain the difference between Normalization and Denormalization in DBMS",
    content: "I understand that normalization reduces redundancy but when should we use denormalization?",
    author: { full_name: "Priya Patel" },
    faculty: "BIM",
    semester: "4",
    tags: ["DBMS", "Normalization", "Database"],
    upvotes: 18,
    answers_count: 3,
    views: 98,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    has_accepted_answer: false,
  },
  {
    id: 3,
    title: "What is the accounting treatment for depreciation under Nepali standards?",
    content: "I'm confused about the different methods of depreciation and how they are applied in the Nepali context.",
    author: { full_name: "Bikash Thapa" },
    faculty: "BBS",
    semester: "2",
    tags: ["Accounting", "Depreciation", "NAS"],
    upvotes: 12,
    answers_count: 2,
    views: 67,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    has_accepted_answer: false,
  },
  {
    id: 4,
    title: "How to solve Newton-Raphson method problems step by step?",
    content: "I need help understanding the Newton-Raphson method for finding roots. The formula is confusing.",
    author: { full_name: "Suman KC" },
    faculty: "Engineering",
    semester: "1",
    tags: ["Mathematics", "Numerical Methods"],
    upvotes: 31,
    answers_count: 7,
    views: 234,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    has_accepted_answer: true,
  },
];

const QuestionList = () => {
  const [activeTab, setActiveTab] = useState('newest');
  
  const tabs = ['Newest', 'Trending', 'Unanswered', 'Most Voted'];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.toLowerCase()
                ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white'
                : 'text-dark-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {mockQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;