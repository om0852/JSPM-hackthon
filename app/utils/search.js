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
    contentType: "course"
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    author: "Design Masters",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    duration: "1:30:00",
    likes: "18K",
    rating: "4.9",
    students: "3.2K",
    type: "Course",
    category: "Art",
    contentType: "course"
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