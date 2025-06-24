import React, { useState, useCallback } from 'react';
import { CourseRanking } from './components/CourseRanking';
import { FileUpload } from './components/FileUpload';
import { CSVParser } from './utils/csvParser';
import { Course, Prerequisite } from './types/Course';
import { BookOpen, Brain, TrendingUp } from 'lucide-react';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [error, setError] = useState<string>('');
  const [hasData, setHasData] = useState(false);

  const handleFileUpload = useCallback((content: string) => {
    try {
      const parseResult = CSVParser.parsePrerequisites(content);
      setCourses(parseResult.courses);
      setPrerequisites(parseResult.prerequisites);
      setHasData(true);
      setError('');
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.');
      console.error('CSV parsing error:', err);
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const loadSampleData = useCallback(() => {
    const sampleData = CSVParser.generateSampleData();
    setCourses(sampleData.courses);
    setPrerequisites(sampleData.prerequisites);
    setHasData(true);
    setError('');
  }, []);

  const clearData = useCallback(() => {
    setCourses([]);
    setPrerequisites([]);
    setHasData(false);
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Ranking</h1>
                <p className="text-sm text-gray-600">PageRank Algorithm Implementation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <p className="text-red-700 font-medium">Error</p>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {!hasData ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Course Dependencies
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Upload your course prerequisite data and use the PageRank algorithm to identify 
                the most foundational courses in your curriculum. Perfect for academic planning 
                and curriculum design.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={loadSampleData}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Try Sample Data
                </button>
                <span className="text-gray-400">or</span>
                <span className="text-gray-600 font-medium">Upload your own CSV file below</span>
              </div>
            </div>

            {/* File Upload */}
            <div className="max-w-2xl mx-auto">
              <FileUpload
                onFileUpload={handleFileUpload}
                onError={handleError}
                className="bg-white/50 backdrop-blur-sm border-white/60"
              />
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PageRank Algorithm</h3>
                <p className="text-gray-600">
                  Advanced graph algorithm implementation to identify the most foundational courses 
                  based on prerequisite relationships.
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Visualization</h3>
                <p className="text-gray-600">
                  Explore course dependencies with interactive graphs showing prerequisite 
                  relationships and ranking scores.
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Curriculum Planning</h3>
                <p className="text-gray-600">
                  Make informed decisions about course sequencing and identify essential 
                  foundation courses for your program.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Data Controls */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{courses.length}</span> courses • 
                    <span className="font-semibold text-gray-900 ml-1">{prerequisites.length}</span> prerequisites
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={loadSampleData}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={clearData}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            </div>

            {/* Course Ranking Component */}
            <CourseRanking 
              courses={courses} 
              prerequisites={prerequisites} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Course Ranking Application • PageRank Algorithm Implementation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;