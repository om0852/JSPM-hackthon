"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  ChevronDown, 
  Clock, 
  CheckCircle,
  Lock,
  FileText,
  BookOpen
} from 'lucide-react';

export default function CourseContent({ course }) {
  const [expandedSections, setExpandedSections] = useState([1]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.isLocked) {
      setSelectedLesson(lesson);
    }
  };

  const getLessonIcon = (type, isLocked) => {
    if (isLocked) return <Lock className="w-4 h-4" />;
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'exercise':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      {/* Course Progress Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-2">Course Curriculum</h2>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{course.totalDuration} total</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>2 of 9 lessons completed</span>
          </div>
        </div>
      </div>

      {/* Course Sections */}
      <div className="divide-y divide-gray-700">
        {course.curriculum.map((section) => (
          <div key={section.id}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
                <h3 className="font-medium text-white">{section.title}</h3>
              </div>
              <span className="text-sm text-gray-400">
                {section.lessons.length} lessons
              </span>
            </button>

            {/* Section Content */}
            <motion.div
              initial={false}
              animate={{
                height: expandedSections.includes(section.id) ? "auto" : 0,
                opacity: expandedSections.includes(section.id) ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 py-2 space-y-1">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    disabled={lesson.isLocked}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-red-500 bg-opacity-10 border border-red-500'
                        : 'hover:bg-gray-700'
                    } ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${
                        lesson.isCompleted ? 'text-green-500' : 'text-gray-400'
                      }`}>
                        {lesson.isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          getLessonIcon(lesson.type, lesson.isLocked)
                        )}
                      </div>
                      <span className={`${
                        selectedLesson?.id === lesson.id ? 'text-red-500' : 'text-white'
                      }`}>
                        {lesson.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{lesson.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
} 