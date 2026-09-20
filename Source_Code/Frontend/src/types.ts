export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  category?: CollegeCategoryKey;
  confidence?: number;
  relatedQuestions?: string[];
  actionData?: {
    type?: 'table' | 'stats' | 'links' | 'eligibility_calculator' | 'fee_breakdown' | 'placement_summary';
    title?: string;
    data?: any;
  };
}

export type CollegeCategoryKey =
  | 'admissions'
  | 'courses'
  | 'fees'
  | 'eligibility'
  | 'scholarships'
  | 'hostel'
  | 'placements'
  | 'examinations';

export interface CategoryInfo {
  key: CollegeCategoryKey;
  iconName: string;
  title: string;
  badge: string;
  description: string;
  color: string;
  gradient: string;
  sampleQuestions: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  categorySummary?: string;
}

export interface AppSettings {
  backendMode: 'local_nlp' | 'custom_api';
  customApiUrl: string;
  apiAuthToken: string;
  simulatedDelayMs: number;
  voiceReadout: boolean;
  soundEffects: boolean;
  confidenceThreshold: number;
  mobileViewOnly: boolean;
  theme?: 'dark' | 'light';
}

export interface CollegeStats {
  naacGrade: string;
  nirfRank: string;
  placementRate: string;
  highestPackage: string;
  averagePackage: string;
  scholarshipDistributed: string;
  totalStudents: string;
  accreditedBy: string[];
}
