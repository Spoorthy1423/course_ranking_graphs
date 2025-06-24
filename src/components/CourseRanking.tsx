import React, { useState, useMemo } from 'react';
import { Course, Prerequisite, PageRankResult } from '../types/Course';
import { PageRankCalculator } from '../algorithms/PageRank';
import { CourseGraph } from './CourseGraph';
import { 
  Trophy, 
  BookOpen, 
  ArrowRight, 
  Download, 
  BarChart3,
  Network,
  Settings,
  Filter
} from 'lucide-react';

interface CourseRankingProps {
  courses: Course[];
  prerequisites: Prerequisite[];
}

export const CourseRanking: React.FC<CourseRankingProps> = ({ courses, prerequisites }) => {
  const [topN, setTopN] = useState(10);
  const [showGraph, setShowGraph] = useState(true);
  const [dampingFactor, setDampingFactor] = useState(0.85);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Calculate PageRank results
  const { pageRankResults, topCourses, calculator } = useMemo(() => {
    const calc = new PageRankCalculator(dampingFactor);
    const results = calc.calculatePageRank(courses, prerequisites);
    const top = calc.getTopFoundationalCourses(courses, prerequisites, topN);
    
    return {
      pageRankResults: results,
      topCourses: top,
      calculator: calc
    };
  }, [courses, prerequisites, topN, dampingFactor]);

  // Create course lookup map
  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach(course => map.set(course.id, course));
    return map;
  }, [courses]);

  // Calculate statistics
  const stats = useMemo(() => {
    const scores = pageRankResults.map(r => r.score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    return { avgScore, maxScore, minScore };
  }, [pageRankResults]);

  const handleExport = () => {
    const csvContent = 'Course ID,Course Name,Rank,PageRank Score\n' +
      pageRankResults.map(result => {
        const course = courseMap.get(result.courseId);
        return `${result.courseId},"${course?.name || result.courseId}",${result.rank},${result.score.toFixed(6)}`;
      }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course-rankings.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (rank <= 5) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-500 bg-gray-50 border-gray-200';
  };

  const getScoreBarWidth = (score: number) => {
    return Math.max((score / stats.maxScore) * 100, 5);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Top N Courses:</label>
              <select
                value={topN}
                onChange={(e) => setTopN(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={15}>Top 15</option>
                <option value={20}>Top 20</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Damping Factor:</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={dampingFactor}
                onChange={(e) => setDampingFactor(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 w-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Table
              </button>
            </div>
            
            <button
              onClick={() => setShowGraph(!showGraph)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showGraph
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Network className="w-4 h-4 inline mr-2" />
              {showGraph ? 'Hide' : 'Show'} Graph
            </button>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.maxScore.toFixed(4)}</div>
            <div className="text-sm text-gray-600">Highest Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.avgScore.toFixed(4)}</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
        </div>
      </div>

      {/* Graph Visualization */}
      {showGraph && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Network className="w-5 h-5 mr-2" />
            Course Dependency Graph
          </h3>
          <CourseGraph 
            courses={courses} 
            prerequisites={prerequisites} 
            pageRankResults={pageRankResults}
          />
        </div>
      )}

      {/* Course Rankings */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Top {topN} Foundational Courses
          </h3>
          <div className="text-sm text-gray-600">
            Ranked by PageRank Algorithm
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-white/80 rounded-lg p-4 border border-white/60 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRankColor(course.rank)}`}>
                    <Trophy className="w-3 h-3 mr-1" />
                    Rank #{course.rank}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">PageRank Score</div>
                    <div className="text-sm font-mono font-semibold text-gray-900">
                      {course.score.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">{course.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{course.id}</p>
                  {course.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Foundation Score</span>
                    <span>{((course.score / stats.maxScore) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getScoreBarWidth(course.score)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">PageRank Score</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Foundation %</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-100/50 hover:bg-white/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRankColor(course.rank)}`}>
                        #{course.rank}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{course.name}</div>
                      {course.description && (
                        <div className="text-xs text-gray-500 mt-1">{course.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-600">{course.id}</td>
                    <td className="py-3 px-4 text-right font-mono text-sm font-semibold text-gray-900">
                      {course.score.toFixed(6)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                            style={{ width: `${getScoreBarWidth(course.score)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-8">
                          {((course.score / stats.maxScore) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Algorithm Info */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          PageRank Algorithm Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">How It Works</h4>
            <p className="text-sm text-gray-600 mb-4">
              The PageRank algorithm treats each course as a node in a directed graph, where 
              edges represent prerequisite relationships. Courses with higher PageRank scores 
              are more foundational as they serve as prerequisites for many other courses.
            </p>
            <div className="text-xs text-gray-500">
              <strong>Implementation:</strong> Custom TypeScript algorithm
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Parameters</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Damping Factor:</span>
                <span className="font-mono font-medium">{dampingFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Iterations:</span>
                <span className="font-mono font-medium">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tolerance:</span>
                <span className="font-mono font-medium">1e-6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Courses Analyzed:</span>
                <span className="font-mono font-medium">{courses.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};