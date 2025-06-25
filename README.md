# 🎓 Course Ranking with PageRank Algorithm

A modern web application that uses the PageRank algorithm to analyze course prerequisites and identify the most foundational courses in academic curricula. Built with React, TypeScript, and Tailwind CSS.

![Course Ranking App](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)

## Demo Link : https://drive.google.com/file/d/1hY3rcVRAAI4ugT-XrIs944_lzALh5Gzn/view?usp=sharing


## 🌟 Features

- **📊 PageRank Algorithm Implementation**: Advanced graph algorithm to identify foundational courses
- **🎨 Interactive Visualization**: Beautiful course dependency graphs with real-time ranking
- **📁 CSV File Upload**: Easy data import with drag-and-drop functionality
- **🔍 Real-time Analysis**: Instant course ranking and dependency analysis
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎯 Sample Data**: Built-in sample dataset for immediate testing and demonstration

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Spoorthy1423/course_ranking_graphs.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 📖 How It Works

### PageRank Algorithm

The application implements a modified PageRank algorithm specifically designed for course prerequisite analysis:

1. **Graph Construction**: Creates a directed graph where courses are nodes and prerequisites are edges
2. **Reversed Analysis**: Uses a reversed graph approach to identify foundational courses (courses that are prerequisites for many others)
3. **Iterative Calculation**: Performs iterative PageRank calculations with configurable damping factor
4. **Convergence Detection**: Automatically detects when the algorithm has converged

### Data Processing

The application accepts CSV files with prerequisite relationships in the format:
```csv
prerequisite,course
MATH100,MATH101
MATH101,MATH102
CS100,CS101
```

### Key Components

- **`PageRankCalculator`**: Core algorithm implementation
- **`CSVParser`**: Handles data import and export
- **`CourseRanking`**: Main visualization component
- **`FileUpload`**: Drag-and-drop file upload interface

## 📊 Data Format

### CSV File Structure

Your CSV file should contain prerequisite relationships with the following format:

```csv
prerequisite,course
MATH100,MATH101
MATH101,MATH102
CS100,CS101
CS101,CS102
```

### Course Information

Each course is automatically generated with:
- **ID**: Unique identifier (from CSV)
- **Name**: Human-readable name (auto-generated from ID)
- **Description**: Course description
- **Credits**: Default credit value (3)

## 🎯 Usage Guide

### 1. Getting Started

1. **Load Sample Data**: Click "Try Sample Data" to see the application in action with pre-loaded course data
2. **Upload Your Data**: Drag and drop a CSV file or click to browse and select your prerequisite data
3. **View Results**: Explore the interactive course ranking and dependency visualization

### 2. Understanding the Results

- **Ranking**: Courses are ranked by their foundational importance (higher rank = more foundational)
- **PageRank Score**: Numerical score indicating the course's importance in the curriculum
- **Dependencies**: Visual representation of prerequisite relationships
- **Graph View**: Interactive network showing course connections

### 3. Data Management

- **Load Sample**: Always available to demonstrate the application
- **Clear Data**: Remove current data and start fresh
- **Export**: Download your data in CSV format

## 🏗️ Project Structure

```
graphhs-assign/
├── src/
│   ├── algorithms/
│   │   └── PageRank.ts          # PageRank algorithm implementation
│   ├── components/
│   │   ├── CourseGraph.tsx      # Interactive graph visualization
│   │   ├── CourseRanking.tsx    # Main ranking display
│   │   └── FileUpload.tsx       # File upload component
│   ├── types/
│   │   └── Course.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── csvParser.ts         # CSV parsing utilities
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔧 Technical Details

### Algorithm Parameters

The PageRank algorithm can be configured with:

- **Damping Factor**: Default 0.85 (controls random walk probability)
- **Max Iterations**: Default 100 (maximum algorithm iterations)
- **Tolerance**: Default 1e-6 (convergence threshold)

### Performance

- **Scalability**: Handles hundreds of courses efficiently
- **Real-time Updates**: Instant recalculation on data changes
- **Memory Efficient**: Optimized data structures for large datasets

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Accessibility**: Keyboard navigation and screen reader support
- **Error Handling**: Clear error messages and validation feedback

## 🛠️ Development

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for beautiful, consistent icons
- **Linting**: ESLint with TypeScript support

### Code Quality

- **TypeScript**: Full type safety and better developer experience
- **ESLint**: Code quality and consistency enforcement
- **Modular Architecture**: Clean separation of concerns
- **Documentation**: Comprehensive code comments and JSDoc

## 🙏 Acknowledgments

- **PageRank Algorithm**: Based on the original algorithm by Larry Page and Sergey Brin
- **React Community**: For the excellent ecosystem and documentation
- **Tailwind CSS**: For the beautiful utility-first CSS framework
- **Vite**: For the lightning-fast build tool

---

**Happy Course Planning! 🎓✨**
