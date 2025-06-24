import React, { useRef, useEffect } from 'react';
import { Course, Prerequisite, PageRankResult } from '../types/Course';

interface CourseGraphProps {
  courses: Course[];
  prerequisites: Prerequisite[];
  pageRankResults: PageRankResult[];
}

export const CourseGraph: React.FC<CourseGraphProps> = ({ 
  courses, 
  prerequisites, 
  pageRankResults 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Create PageRank score map
    const scoreMap = new Map<string, number>();
    pageRankResults.forEach(result => {
      scoreMap.set(result.courseId, result.score);
    });

    // Calculate hierarchical positions based on prerequisite levels
    const levels = new Map<string, number>();
    const visited = new Set<string>();
    
    // Calculate depth for each course (foundational courses have lower depth)
    const calculateDepth = (courseId: string): number => {
      if (visited.has(courseId)) return levels.get(courseId) || 0;
      visited.add(courseId);
      
      const prereqs = prerequisites.filter(p => p.course === courseId);
      if (prereqs.length === 0) {
        levels.set(courseId, 0);
        return 0;
      }
      
      const maxPrereqDepth = Math.max(...prereqs.map(p => calculateDepth(p.prerequisite)));
      const depth = maxPrereqDepth + 1;
      levels.set(courseId, depth);
      return depth;
    };

    courses.forEach(course => calculateDepth(course.id));
    
    const maxLevel = Math.max(...Array.from(levels.values()));
    const levelGroups = new Map<number, string[]>();
    
    // Group courses by level
    for (let i = 0; i <= maxLevel; i++) {
      levelGroups.set(i, []);
    }
    
    levels.forEach((level, courseId) => {
      levelGroups.get(level)!.push(courseId);
    });

    // Position nodes in a hierarchical layout
    const nodePositions = new Map<string, { x: number; y: number }>();
    const padding = 80;
    const levelHeight = (rect.height - 2 * padding) / Math.max(maxLevel, 1);
    
    levelGroups.forEach((coursesInLevel, level) => {
      const y = padding + level * levelHeight;
      const levelWidth = rect.width - 2 * padding;
      const spacing = coursesInLevel.length > 1 ? levelWidth / (coursesInLevel.length - 1) : 0;
      
      coursesInLevel.forEach((courseId, index) => {
        const x = coursesInLevel.length === 1 
          ? rect.width / 2 
          : padding + index * spacing;
        nodePositions.set(courseId, { x, y });
      });
    });

    // Draw edges first (so they appear behind nodes)
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;

    prerequisites.forEach(({ prerequisite, course }) => {
      const startPos = nodePositions.get(prerequisite);
      const endPos = nodePositions.get(course);
      
      if (startPos && endPos) {
        // Draw curved edge
        const midX = (startPos.x + endPos.x) / 2;
        const midY = (startPos.y + endPos.y) / 2;
        const controlX = midX + (endPos.x - startPos.x) * 0.1;
        const controlY = midY - Math.abs(endPos.y - startPos.y) * 0.3;

        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.quadraticCurveTo(controlX, controlY, endPos.x, endPos.y);
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(endPos.y - controlY, endPos.x - controlX);
        const arrowLength = 12;
        const arrowAngle = Math.PI / 6;

        const arrowX = endPos.x - 25 * Math.cos(angle);
        const arrowY = endPos.y - 25 * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle - arrowAngle),
          arrowY - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle + arrowAngle),
          arrowY - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
      }
    });

    // Reset alpha for nodes
    ctx.globalAlpha = 1;

    // Draw nodes
    const maxScore = Math.max(...Array.from(scoreMap.values()));
    const minScore = Math.min(...Array.from(scoreMap.values()));
    const scoreRange = maxScore - minScore;

    courses.forEach(course => {
      const pos = nodePositions.get(course.id);
      if (!pos) return;

      const score = scoreMap.get(course.id) || 0;
      const normalizedScore = scoreRange > 0 ? (score - minScore) / scoreRange : 0.5;
      
      // Node size based on PageRank score
      const baseRadius = 20;
      const radius = baseRadius + normalizedScore * 15;

      // Enhanced color scheme for foundational courses
      const hue = 220 - normalizedScore * 60; // Blue to purple gradient
      const saturation = 70 + normalizedScore * 20;
      const lightness = 45 + normalizedScore * 10;

      // Gradient fill
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
      gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness + 15}%)`);
      gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness}%)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Enhanced border with shadow effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Course ID text with better typography
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const text = course.id.length > 10 ? course.id.substring(0, 8) + '...' : course.id;
      ctx.fillText(text, pos.x, pos.y);

      // Score text below node
      ctx.fillStyle = '#64748B';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(score.toFixed(3), pos.x, pos.y + radius + 15);
    });

    // Enhanced legend
    const legendX = 20;
    const legendY = 20;
    const legendWidth = 220;
    const legendHeight = 100;

    // Legend background with gradient
    const legendGradient = ctx.createLinearGradient(legendX, legendY, legendX, legendY + legendHeight);
    legendGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    legendGradient.addColorStop(1, 'rgba(248, 250, 252, 0.95)');
    
    ctx.fillStyle = legendGradient;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

    // Legend title
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PageRank Scores', legendX + 15, legendY + 25);

    // Legend description
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Higher scores = More foundational', legendX + 15, legendY + 45);

    // Legend scale values
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`High: ${maxScore.toFixed(4)}`, legendX + 15, legendY + 65);
    ctx.fillText(`Low: ${minScore.toFixed(4)}`, legendX + 15, legendY + 80);

    // Enhanced color scale
    const scaleWidth = 80;
    const scaleHeight = 12;
    const scaleX = legendX + 130;
    const scaleY = legendY + 60;

    const scaleGradient = ctx.createLinearGradient(scaleX, 0, scaleX + scaleWidth, 0);
    scaleGradient.addColorStop(0, 'hsl(160, 70%, 55%)');
    scaleGradient.addColorStop(0.5, 'hsl(200, 70%, 55%)');
    scaleGradient.addColorStop(1, 'hsl(240, 70%, 55%)');

    ctx.fillStyle = scaleGradient;
    ctx.fillRect(scaleX, scaleY, scaleWidth, scaleHeight);
    
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(scaleX, scaleY, scaleWidth, scaleHeight);

  }, [courses, prerequisites, pageRankResults]);

  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl border border-slate-200/60 overflow-hidden shadow-inner">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};