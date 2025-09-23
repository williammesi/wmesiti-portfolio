/**
 * Error Handling Utilities
 * Centralized error handling, logging, and fallback strategies
 */

import type { ApiError, LoadingState } from '@/types/sanity';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  SANITY_API = 'SANITY_API',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN = 'UNKNOWN',
}

// Enhanced error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly timestamp: Date;
  public readonly retryable: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    details?: unknown,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.retryable = retryable;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Error classification helper
export function classifyError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch')) {
      return new AppError(
        'Erreur de connexion réseau',
        ErrorType.NETWORK,
        'NETWORK_ERROR',
        error,
        true
      );
    }

    // Sanity-specific errors
    if (error.message.includes('sanity') || error.message.includes('GROQ')) {
      return new AppError(
        'Erreur lors du chargement des données',
        ErrorType.SANITY_API,
        'SANITY_ERROR',
        error,
        true
      );
    }

    // 404 errors
    if (error.message.includes('404') || error.message.includes('not found')) {
      return new AppError(
        'Contenu non trouvé',
        ErrorType.NOT_FOUND,
        'NOT_FOUND',
        error,
        false
      );
    }

    return new AppError(
      error.message,
      ErrorType.UNKNOWN,
      'UNKNOWN_ERROR',
      error,
      false
    );
  }

  return new AppError(
    'Une erreur inattendue s\'est produite',
    ErrorType.UNKNOWN,
    'UNKNOWN_ERROR',
    error,
    false
  );
}

// Retry configuration
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

// Retry with exponential backoff
export async function retry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxAttempts, baseDelay, maxDelay, backoffFactor } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: AppError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = classifyError(error);

      // Don't retry non-retryable errors
      if (!lastError.retryable || attempt === maxAttempts) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));

      logError(lastError, { attempt, maxAttempts });
    }
  }

  throw lastError!;
}

// Error logging (client-side safe)
export function logError(error: AppError, context?: Record<string, unknown>) {
  const errorInfo = {
    message: error.message,
    type: error.type,
    code: error.code,
    timestamp: error.timestamp,
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  };

  // Console logging (always available)
  console.error('[Portfolio Error]', errorInfo);

  // Optional: Send to monitoring service in production
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    // Example: Send to Sentry, LogRocket, or similar service
    // sendToMonitoringService(errorInfo);
  }
}

// Fallback data generators
export const fallbackData = {
  project: {
    _id: 'fallback',
    title: 'Projet non disponible',
    slug: { current: 'fallback' },
    summary: 'Ce projet n\'est temporairement pas disponible.',
    description: 'Nous rencontrons des difficultés techniques. Veuillez réessayer plus tard.',
    status: 'completed' as const,
    year: new Date().getFullYear(),
    thumbnail: {
      asset: { _ref: 'fallback-image' }
    },
    technologies: ['Indisponible'],
    featured: false,
  },

  projects: [],

  skills: [],

  experiences: [],
} as const;

// Loading state manager
export class LoadingStateManager {
  private state: LoadingState = { isLoading: false };
  private listeners: ((state: LoadingState) => void)[] = [];

  setLoading(isLoading: boolean) {
    this.state = { ...this.state, isLoading, error: isLoading ? undefined : this.state.error };
    this.notifyListeners();
  }

  setError(error: ApiError) {
    this.state = { isLoading: false, error };
    this.notifyListeners();
  }

  clearError() {
    this.state = { ...this.state, error: undefined };
    this.notifyListeners();
  }

  getState(): LoadingState {
    return { ...this.state };
  }

  subscribe(listener: (state: LoadingState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T,
  retryConfig?: Partial<RetryConfig>
): Promise<T> {
  try {
    if (retryConfig || fallback === undefined) {
      return await retry(operation, retryConfig);
    }
    return await operation();
  } catch (error) {
    const appError = classifyError(error);
    logError(appError);

    if (fallback !== undefined) {
      return fallback;
    }

    throw appError;
  }
}

// Environment-specific error messages
export function getErrorMessage(error: AppError, isDev: boolean = !import.meta.env.PROD): string {
  if (isDev) {
    return `[${error.type}] ${error.message}${error.code ? ` (${error.code})` : ''}`;
  }

  // User-friendly messages for production
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Problème de connexion. Vérifiez votre connexion internet.';
    case ErrorType.SANITY_API:
      return 'Contenu temporairement indisponible. Veuillez réessayer.';
    case ErrorType.NOT_FOUND:
      return 'Contenu non trouvé.';
    case ErrorType.UNAUTHORIZED:
      return 'Accès non autorisé.';
    default:
      return 'Une erreur s\'est produite. Veuillez réessayer.';
  }
}

// Performance monitoring helpers
export function measurePerformance<T>(
  name: string,
  operation: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();

  const handleResult = (result: T) => {
    const duration = performance.now() - start;
    console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  };

  const handleError = (error: unknown) => {
    const duration = performance.now() - start;
    console.debug(`[Performance] ${name} failed after: ${duration.toFixed(2)}ms`);
    throw error;
  };

  try {
    const result = operation();
    if (result instanceof Promise) {
      return result.then(handleResult).catch(handleError);
    }
    return handleResult(result);
  } catch (error) {
    return handleError(error);
  }
}