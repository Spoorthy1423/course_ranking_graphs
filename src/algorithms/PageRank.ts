// PageRank algorithm implementation for course prerequisites

import { Course, Prerequisite, CourseNode, PageRankResult } from '../types/Course';

export class PageRankCalculator {
  private dampingFactor: number = 0.85;
  private maxIterations: number = 100;
  private tolerance: number = 1e-6;

  constructor(dampingFactor?: number, maxIterations?: number, tolerance?: number) {
    if (dampingFactor) this.dampingFactor = dampingFactor;
    if (maxIterations) this.maxIterations = maxIterations;
    if (tolerance) this.tolerance = tolerance;
  }

  /**
   * Calculate PageRank scores for courses based on prerequisites
   * Higher scores indicate more foundational courses (courses that are prerequisites for many others)
   */
  calculatePageRank(courses: Course[], prerequisites: Prerequisite[]): PageRankResult[] {
    // Create adjacency lists - REVERSED for foundational ranking
    const courseMap = new Map<string, CourseNode>();
    const inLinks = new Map<string, Set<string>>();
    const outLinks = new Map<string, Set<string>>();

    // Initialize course nodes
    courses.forEach(course => {
      courseMap.set(course.id, {
        ...course,
        pageRank: 1.0,
        inDegree: 0,
        outDegree: 0,
        prerequisites: [],
        dependents: []
      });
      inLinks.set(course.id, new Set());
      outLinks.set(course.id, new Set());
    });

    // Build REVERSED graph: Course -> Prerequisite (to rank foundational courses higher)
    prerequisites.forEach(({ prerequisite, course }) => {
      if (courseMap.has(prerequisite) && courseMap.has(course)) {
        // REVERSED: Course points to its prerequisite
        outLinks.get(course)!.add(prerequisite);
        inLinks.get(prerequisite)!.add(course);
        
        const prereqNode = courseMap.get(prerequisite)!;
        const courseNode = courseMap.get(course)!;
        
        prereqNode.dependents.push(course);
        courseNode.prerequisites.push(prerequisite);
      }
    });

    // Update degrees
    courseMap.forEach((node, courseId) => {
      node.inDegree = inLinks.get(courseId)!.size;
      node.outDegree = outLinks.get(courseId)!.size;
    });

    const N = courses.length;
    const pageRanks = new Map<string, number>();
    
    // Initialize PageRank values
    courses.forEach(course => {
      pageRanks.set(course.id, 1.0 / N);
    });

    // Iterative PageRank calculation
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      const newPageRanks = new Map<string, number>();
      let maxDiff = 0;

      courses.forEach(course => {
        let rank = (1 - this.dampingFactor) / N;
        // Sum contributions from courses that depend on this course
        const incomingLinks = inLinks.get(course.id)!;
        incomingLinks.forEach(dependentId => {
          const dependentOutDegree = outLinks.get(dependentId)!.size;
          if (dependentOutDegree > 0) {
            rank += this.dampingFactor * (pageRanks.get(dependentId)! / dependentOutDegree);
          }
        });
        newPageRanks.set(course.id, rank);
        maxDiff = Math.max(maxDiff, Math.abs(rank - pageRanks.get(course.id)!));
      });

      // Update PageRank values
      newPageRanks.forEach((rank, courseId) => {
        pageRanks.set(courseId, rank);
        courseMap.get(courseId)!.pageRank = rank;
      });

      // Check for convergence
      if (maxDiff < this.tolerance) {
        console.log(`PageRank converged after ${iteration + 1} iterations`);
        break;
      }
    }

    // Create results and sort by PageRank score (descending)
    const results: PageRankResult[] = Array.from(pageRanks.entries())
      .map(([courseId, score]) => ({ courseId, rank: 0, score }))
      .sort((a, b) => b.score - a.score);

    // Assign ranks
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results;
  }

  /**
   * Get top N most foundational courses
   */
  getTopFoundationalCourses(
    courses: Course[], 
    prerequisites: Prerequisite[], 
    topN: number = 10
  ): (CourseNode & { rank: number; score: number })[] {
    const pageRankResults = this.calculatePageRank(courses, prerequisites);
    const courseMap = new Map<string, Course>();
    courses.forEach(course => courseMap.set(course.id, course));

    return pageRankResults
      .slice(0, topN)
      .map(result => {
        const course = courseMap.get(result.courseId)!;
        return {
          ...course,
          pageRank: result.score,
          rank: result.rank,
          score: result.score,
          inDegree: 0,
          outDegree: 0,
          prerequisites: [],
          dependents: []
        };
      });
  }
}