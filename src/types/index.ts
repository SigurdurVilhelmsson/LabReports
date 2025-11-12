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
}

export interface ExperimentConfig {
  id: string;
  title: string;
  year: number;
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
}

export interface AnalysisResult {
  filename: string;
  sections?: {
    [sectionId: string]: SectionAnalysis;
  };
  suggestedGrade?: string;
  error?: string;
}

// Student assistance types
export interface StudentFeedback {
  filename: string;
  overallAssessment: string;
  sections: {
    [sectionId: string]: {
      present: boolean;
      strengths?: string[];
      improvements?: string[];
      suggestions?: string[];
    };
  };
  nextSteps?: string[];
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
  type: 'text' | 'image' | 'pdf';
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

// Storage interface
export interface StorageResult {
  keys: string[];
}

export interface StorageValue {
  value: string;
}
