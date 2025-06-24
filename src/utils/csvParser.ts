import { Course, Prerequisite } from '../types/Course';

export interface CSVParseResult {
  courses: Course[];
  prerequisites: Prerequisite[];
}

export class CSVParser {
  /**
   * Parse CSV content for course prerequisites
   * Expected format: prerequisite_id,course_id or prerequisite_name,course_name
   */
  static parsePrerequisites(csvContent: string): CSVParseResult {
    const lines = csvContent.trim().split('\n');
    const prerequisites: Prerequisite[] = [];
    const courseSet = new Set<string>();

    // Skip header if present
    const dataLines = lines[0].toLowerCase().includes('prerequisite') ? lines.slice(1) : lines;

    dataLines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const [prerequisite, course] = trimmed.split(',').map(s => s.trim().replace(/"/g, ''));
      
      if (prerequisite && course) {
        prerequisites.push({ prerequisite, course });
        courseSet.add(prerequisite);
        courseSet.add(course);
      }
    });

    // Generate course objects from unique course IDs
    const courses: Course[] = Array.from(courseSet).map(courseId => ({
      id: courseId,
      name: courseId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Course: ${courseId}`,
      credits: 3
    }));

    return { courses, prerequisites };
  }

  /**
   * Parse comprehensive course CSV with columns: id,name,description,credits
   */
  static parseCourses(csvContent: string): Course[] {
    const lines = csvContent.trim().split('\n');
    const courses: Course[] = [];

    // Skip header
    const dataLines = lines.slice(1);

    dataLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const [id, name, description, credits] = trimmed.split(',').map(s => s.trim().replace(/"/g, ''));
      
      if (id && name) {
        courses.push({
          id,
          name,
          description: description || `Course: ${name}`,
          credits: credits ? parseInt(credits) : 3
        });
      }
    });

    return courses;
  }

  /**
   * Generate sample course data for demonstration
   */
  static generateSampleData(): CSVParseResult {
    const courses: Course[] = [
      { id: 'MATH100', name: 'Basic Mathematics', description: 'Fundamental mathematical concepts', credits: 3 },
      { id: 'MATH101', name: 'Calculus I', description: 'Introduction to differential calculus', credits: 4 },
      { id: 'MATH102', name: 'Calculus II', description: 'Integral calculus and series', credits: 4 },
      { id: 'MATH201', name: 'Linear Algebra', description: 'Vector spaces and matrices', credits: 3 },
      { id: 'CS100', name: 'Introduction to Computing', description: 'Basic computer concepts', credits: 3 },
      { id: 'CS101', name: 'Programming I', description: 'Introduction to programming', credits: 3 },
      { id: 'CS102', name: 'Programming II', description: 'Data structures and algorithms', credits: 3 },
      { id: 'CS201', name: 'Computer Architecture', description: 'Hardware and system design', credits: 3 },
      { id: 'CS301', name: 'Database Systems', description: 'Database design and management', credits: 3 },
      { id: 'CS302', name: 'Software Engineering', description: 'Software development lifecycle', credits: 3 },
      { id: 'CS401', name: 'Machine Learning', description: 'AI and machine learning algorithms', credits: 3 },
      { id: 'STATS101', name: 'Statistics', description: 'Probability and statistical inference', credits: 3 }
    ];

    const prerequisites: Prerequisite[] = [
      { prerequisite: 'MATH100', course: 'MATH101' },
      { prerequisite: 'MATH101', course: 'MATH102' },
      { prerequisite: 'MATH100', course: 'MATH201' },
      { prerequisite: 'MATH102', course: 'CS401' },
      { prerequisite: 'MATH201', course: 'CS401' },
      { prerequisite: 'CS100', course: 'CS101' },
      { prerequisite: 'CS101', course: 'CS102' },
      { prerequisite: 'CS100', course: 'CS201' },
      { prerequisite: 'CS102', course: 'CS301' },
      { prerequisite: 'CS102', course: 'CS302' },
      { prerequisite: 'CS201', course: 'CS302' },
      { prerequisite: 'CS301', course: 'CS401' },
      { prerequisite: 'MATH100', course: 'STATS101' },
      { prerequisite: 'STATS101', course: 'CS401' }
    ];

    return { courses, prerequisites };
  }

  /**
   * Export data to CSV format
   */
  static exportToCSV(courses: Course[], prerequisites: Prerequisite[]): string {
    let csv = 'prerequisite,course\n';
    prerequisites.forEach(({ prerequisite, course }) => {
      csv += `${prerequisite},${course}\n`;
    });
    return csv;
  }
}