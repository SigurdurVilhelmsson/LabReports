// Application modes
export type AppMode = 'teacher' | 'student';

// Experiment and section types
export interface SectionCriteria {
  good: string;
  needsImprovement?: string;
  unsatisfactory: string;
}

export interface ExperimentSection {
  id: string;
  name: string;
  description: string;
  criteria: SectionCriteria;
  specialNote?: string;
  maxPoints?: number; // Maximum points for this section
}

export interface Worksheet {
  reaction: string;
  materials: string[];
  equipment: string[];
  steps: string[];
}

export interface ExperimentConfig {
  id: string;
  title: string;
  year: number;
  worksheet?: Worksheet;
  sections: ExperimentSection[];
  gradeScale: string[];
}

export interface ExperimentConfigs {
  [key: string]: ExperimentConfig;
}

// Analysis results
export interface SectionAnalysis {
  present: boolean;
  quality?: 'good' | 'needs improvement' | 'unsatisfactory';
  note?: string;
  points?: number; // Points earned for this section
  maxPoints?: number; // Maximum points possible for this section
  reasoning?: string; // Explanation for point deductions (teacher mode)
}

export interface AnalysisResult {
  filename: string;
  sections?: {
    [sectionId: string]: SectionAnalysis;
  };
  suggestedGrade?: string;
  totalPoints?: number; // Total points earned (e.g., 25)
  maxTotalPoints?: number; // Maximum possible points (e.g., 30)
  quickSummary?: string; // Brief summary for teachers
  error?: string;
}

// Student assistance types
export interface StudentFeedback {
  filename: string;
  overallAssessment?: string;
  heildareinkunn?: string; // Total grade (e.g., "25/30")
  totalPoints?: number;
  maxTotalPoints?: number;
  styrkir?: string[]; // Overall strengths
  almennarAthugasemdir?: string[]; // General comments
  sections: {
    [sectionId: string]: {
      present: boolean;
      points?: number;
      maxPoints?: number;
      strengths?: string[];
      improvements?: string[];
      suggestions?: string[];
      athugasemdir?: string; // Comments in Icelandic
    };
  };
  nextSteps?: string[];
  næstuSkref?: string[]; // Next steps in Icelandic
}

// Session management
export interface GradingSession {
  id: string;
  name: string;
  experiment: string;
  timestamp: string;
  results: AnalysisResult[];
  fileCount: number;
  mode: AppMode;
}

// File processing
export interface FileContent {
  type: 'text' | 'image' | 'pdf' | 'docx';
  data: string;
  mediaType?: string;
  images?: Array<{
    data: string;
    mediaType: string;
  }>;
}

// Toast notification
export interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// Processing status
export interface ProcessingStatus {
  current: number;
  total: number;
  currentFile: string;
}
