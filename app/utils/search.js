// Content data
const videos = [
  {
    id: 1,
    title: "Introduction to Web3 and Blockchain",
    author: "Crypto Academy",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    views: "89K",
    duration: "45:20",
    likes: "9.5K",
    type: "Video",
    category: "Tech",
    contentType: "video"
  },
  {
    id: 2,
    title: "Getting Started with TypeScript",
    author: "Code Masters",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
    views: "75K",
    duration: "32:15",
    likes: "8K",
    type: "Video",
    category: "Tech",
    contentType: "video"
  }
];

const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2024",
    author: "John Developer",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    duration: "2:15:30",
    likes: "12K",
    rating: "4.8",
    students: "2.5K",
    type: "Course",
    category: "Tech",
    contentType: "course",
    price: "$89.99",
    totalLessons: "45 lessons",
    totalDuration: "15 hours",
    level: "Beginner to Advanced",
    lastUpdated: "January 2024",
    description: "Master web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and get hands-on experience.",
    requirements: [
      "Basic computer knowledge",
      "No prior programming experience needed",
      "A computer with internet connection"
    ],
    whatYouWillLearn: [
      "Build responsive websites using HTML5 and CSS3",
      "Master JavaScript and modern ES6+ features",
      "Create full-stack applications with React and Node.js",
      "Understand database design and implementation",
      "Deploy applications to the cloud"
    ],
    curriculum: [
      {
        id: 1,
        title: "Getting Started",
        lessons: [
          {
            id: 1,
            title: "Course Introduction",
            duration: "5:20",
            type: "video",
            isCompleted: true,
            isLocked: false
          },
          {
            id: 2,
            title: "Setting Up Your Development Environment",
            duration: "15:45",
            type: "video",
            isCompleted: true,
            isLocked: false
          }
        ]
      },
      {
        id: 2,
        title: "HTML & CSS Fundamentals",
        lessons: [
          {
            id: 3,
            title: "HTML Basics",
            duration: "20:15",
            type: "video",
            isCompleted: false,
            isLocked: false
          },
          {
            id: 4,
            title: "CSS Styling",
            duration: "25:30",
            type: "video",
            isCompleted: false,
            isLocked: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    author: "Design Masters",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    duration: "1:30:00",
    likes: "18K",
    rating: "4.9",
    students: "3.2K",
    type: "Course",
    category: "Design",
    contentType: "course",
    price: "$69.99",
    totalLessons: "35 lessons",
    totalDuration: "12 hours",
    level: "Intermediate",
    lastUpdated: "February 2024",
    description: "Learn professional UI/UX design. Master Figma, design principles, user research, prototyping, and create stunning user interfaces.",
    requirements: [
      "Basic design knowledge helpful but not required",
      "Figma account (free)",
      "Passion for design"
    ],
    whatYouWillLearn: [
      "Master Figma for UI design",
      "Understand UX principles and methodologies",
      "Create high-fidelity prototypes",
      "Conduct user research and testing",
      "Build a professional design portfolio"
    ],
    curriculum: [
      {
        id: 1,
        title: "Introduction to UI/UX",
        lessons: [
          {
            id: 1,
            title: "What is UI/UX Design",
            duration: "10:30",
            type: "video",
            isCompleted: false,
            isLocked: false
          },
          {
            id: 2,
            title: "Design Thinking Process",
            duration: "15:20",
            type: "video",
            isCompleted: false,
            isLocked: false
          }
        ]
      },
      {
        id: 2,
        title: "Figma Essentials",
        lessons: [
          {
            id: 3,
            title: "Figma Interface Overview",
            duration: "20:15",
            type: "video",
            isCompleted: false,
            isLocked: true
          },
          {
            id: 4,
            title: "Working with Components",
            duration: "25:45",
            type: "video",
            isCompleted: false,
            isLocked: true
          }
        ]
      }
    ]
  }
];

const articles = [
  {
    id: 1,
    title: "Understanding Modern JavaScript",
    author: "Sarah Johnson",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    readTime: "5 min read",
    likes: "8.2K",
    type: "Article",
    category: "Tech",
    contentType: "article",
    excerpt: "Dive deep into modern JavaScript features and best practices. Learn about the latest ES6+ features, async/await, modules, and more. This comprehensive guide will help you understand modern JavaScript development."
  },
  {
    id: 2,
    title: "The Complete Guide to React Hooks",
    author: "Mike Chen",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    readTime: "8 min read",
    likes: "12K",
    type: "Article",
    category: "Tech",
    contentType: "article",
    excerpt: "Learn how to leverage React Hooks to write cleaner, more efficient code. Understand useState, useEffect, useContext, and custom hooks. This guide includes practical examples and best practices."
  }
];

const images = [
  {
    id: 1,
    title: "Modern Web Development Setup",
    photographer: "Tech Visuals",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    likes: "2.3K",
    downloads: "1.2K",
    type: "Image",
    category: "Tech",
    contentType: "image"
  },
  {
    id: 2,
    title: "AI and Machine Learning Concept",
    photographer: "Future Labs",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    likes: "3.1K",
    downloads: "856",
    type: "Image",
    category: "Tech",
    contentType: "image"
  }
];

// Combine all content
const allContent = [
  ...videos,
  ...courses,
  ...articles,
  ...images
];

export const searchContent = (query) => {
  if (!query) return allContent;
  
  const searchTerm = query.toLowerCase();
  
  return allContent.filter(item => {
    const searchableFields = [
      item.title,
      item.provider || item.author || item.photographer,
      item.type,
      item.category
    ].filter(Boolean);
    
    return searchableFields.some(field => 
      field.toLowerCase().includes(searchTerm)
    );
  }).slice(0, 5); // Limit results to 5 items
}; 