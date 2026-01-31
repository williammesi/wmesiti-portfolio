/**
 * Centralized TypeScript interfaces for Sanity CMS data
 * Ensures type consistency across the entire application
 */

// Base Sanity types
export interface SanityDocument {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: string;
}

export interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SanitySlug {
  current: string;
  _type: 'slug';
}

// Project-related interfaces
export interface Project extends SanityDocument {
  title: string;
  slug: SanitySlug;
  summary: string;
  description: string;
  status: 'completed' | 'inProgress';
  year: number;
  thumbnail: SanityImage;
  image1?: SanityImage;
  image2?: SanityImage;
  image3?: SanityImage;
  technologies: string[];
  features?: Feature[];
  challenges?: Challenge[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order?: number;
}

export interface Feature {
  name: string;
  description: string;
  image?: SanityImage;
}

export interface Challenge {
  challengeName: string;
  challengeDescription: string;
  solutionName: string;
  solutionDescription: string;
}

// Blog-related interfaces
export interface BlogCategory extends SanityDocument {
  title: string;
  slug: SanitySlug;
  description?: string;
  isProtected: boolean;
  passwordHash?: string;
  order?: number;
}

export interface BlogPost extends SanityDocument {
  title: string;
  slug: SanitySlug;
  category: BlogCategory;
  excerpt: string;
  coverImage?: SanityImage;
  content: PortableTextBlock[];
  publishedAt: string;
  featured: boolean;
  order?: number;
}

// Blog preview types (without sensitive data)
export type BlogCategoryPublic = Omit<BlogCategory, 'passwordHash'>;
export type BlogPostPreview = Pick<BlogPost, '_id' | 'title' | 'slug' | 'excerpt' | 'coverImage' | 'publishedAt' | 'featured'> & {
  category: Pick<BlogCategory, 'title' | 'slug' | 'isProtected'>;
};

// Weekly Log interfaces
export interface TaskItem {
  _key?: string;
  taskName: string;
  completed: boolean;
}

export interface QAItem {
  _key?: string;
  question: string;
  answer?: string;
}

export interface WeeklyLog extends SanityDocument {
  title: string;
  slug: SanitySlug;
  category: BlogCategory;
  weekNumber: number;
  publishedAt: string;
  part1Tasks?: TaskItem[];
  part2SupervisorQA?: QAItem[];
  part3TeacherQA?: QAItem[];
  part4Notes?: PortableTextBlock[];
  order?: number;
}

export type WeeklyLogPreview = Pick<WeeklyLog, '_id' | 'title' | 'slug' | 'weekNumber' | 'publishedAt'> & {
  category: Pick<BlogCategory, 'title' | 'slug' | 'isProtected'>;
};

// Skills and Experience interfaces
export interface Skill extends SanityDocument {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: SanityImage;
  order?: number;
}

export interface Experience extends SanityDocument {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies: string[];
  achievements?: string[];
  location?: string;
  order?: number;
}

// Content blocks (for rich text content)
export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: string;
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    [key: string]: any;
  }>;
}

// API Response types
export interface SanityResponse<T> {
  result: T;
  query: string;
  ms: number;
}

// Project status configuration
export const PROJECT_STATUS = {
  completed: {
    label: 'Complété',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  inProgress: {
    label: 'En cours',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
} as const;

export type ProjectStatus = keyof typeof PROJECT_STATUS;

// Skill levels configuration
export const SKILL_LEVELS = {
  beginner: {
    label: 'Débutant',
    value: 1,
  },
  intermediate: {
    label: 'Intermédiaire',
    value: 2,
  },
  advanced: {
    label: 'Avancé',
    value: 3,
  },
  expert: {
    label: 'Expert',
    value: 4,
  },
} as const;

export type SkillLevel = keyof typeof SKILL_LEVELS;

// Component prop types
export interface ProjectCardProps {
  project: Project;
  loading?: boolean;
}

export interface ProjectDetailProps {
  slug: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

// Error handling types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface LoadingState {
  isLoading: boolean;
  error?: ApiError;
}

// Image optimization types
export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'auto';
  fit?: 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'clip' | 'min';
}

// Utility types
export type ProjectWithoutContent = Omit<Project, 'description' | 'features' | 'challenges'>;
export type ProjectPreview = Pick<Project, '_id' | 'title' | 'slug' | 'summary' | 'status' | 'year' | 'thumbnail' | 'technologies' | 'featured'>;