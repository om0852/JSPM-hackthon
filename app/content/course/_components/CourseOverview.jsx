"use client";

import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  BarChart, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function CourseOverview({ course }) {
  return (
    <div className="space-y-6">
      {/* Course Description */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">About This Course</h2>
        <p className="text-gray-300 leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-white">Course Duration</h3>
          </div>
          <div className="space-y-2 text-gray-300">
            <p>Total Duration: {course.totalDuration}</p>
            <p>Total Content: {course.totalLessons}</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-white">Course Level</h3>
          </div>
          <div className="space-y-2 text-gray-300">
            <p>{course.level}</p>
            <p>Last Updated: {course.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.whatYouWillLearn.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
        <div className="space-y-3">
          {course.requirements.map((requirement, index) => (
            <div key={index} className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">{requirement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Stats Footer */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Users className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Students</p>
            <p className="text-lg font-semibold text-white">{course.students}</p>
          </div>
          <div className="text-center">
            <Clock className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Duration</p>
            <p className="text-lg font-semibold text-white">{course.totalDuration}</p>
          </div>
          <div className="text-center">
            <BarChart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Level</p>
            <p className="text-lg font-semibold text-white">{course.level}</p>
          </div>
          <div className="text-center">
            <Calendar className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="text-lg font-semibold text-white">{course.lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 