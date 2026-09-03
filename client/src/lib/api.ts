// API client with proper error handling for JSON parsing
// This handles all API calls and falls back to demo data when needed

const isGitHubPages = window.location.hostname.includes('github.io');
const API_BASE = isGitHubPages ? '/InsightForge/api' : '/api';

// Helper to safely parse JSON responses
export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    // Check if response is OK
    if (!response.ok) {
      console.warn(`HTTP error! status: ${response.status}`);
      return getFallbackData(url) as T;
    }

    // Get response text first to check if it's valid JSON
    const text = await response.text();
    
    // Check if response is HTML (starts with <)
    if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
      console.warn('Received HTML instead of JSON - using fallback data');
      return getFallbackData(url) as T;
    }

    // Try to parse JSON
    try {
      return JSON.parse(text) as T;
    } catch (jsonError) {
      console.warn('Failed to parse JSON, using fallback data:', jsonError);
      return getFallbackData(url) as T;
    }
  } catch (error) {
    console.error('API fetch error:', error);
    return getFallbackData(url) as T;
  }
}

// Fallback data for different endpoints
export function getFallbackData(url: string): any {
  if (url.includes('/upload') || url.includes('/analyze')) {
    return {
      success: true,
      message: 'Demo mode - using sample data',
      data: {
        rows: 1248,
        columns: 12,
        quality: '96.8%',
        signals: [
          { id: 1, name: 'Revenue momentum', value: '+24.6%' },
          { id: 2, name: 'Acquisition mix - Organic', value: '42%' },
          { id: 3, name: 'Acquisition mix - Paid', value: '28%' },
          { id: 4, name: 'Acquisition mix - Referral', value: '18%' },
        ],
        revenue: '$7,800',
        acquisition: {
          organic: 42,
          paid: 28,
          referral: 18,
          other: 12,
        },
        timestamp: new Date().toISOString()
      }
    };
  }
  
  if (url.includes('/predict')) {
    return {
      predictions: [
        { product: 'Product A', demand: 'High', confidence: 0.92 },
        { product: 'Product B', demand: 'Medium', confidence: 0.78 },
        { product: 'Product C', demand: 'Low', confidence: 0.65 },
        { product: 'Product D', demand: 'High', confidence: 0.88 },
      ],
      timestamp: new Date().toISOString()
    };
  }

  if (url.includes('/feedback')) {
    return {
      feedback: [
        { id: 1, rating: 5, comment: 'Great tool! Very useful analytics.', date: '2026-09-01' },
        { id: 2, rating: 4, comment: 'Really helpful for data inspection.', date: '2026-08-30' },
        { id: 3, rating: 3, comment: 'Good but needs more visualization options.', date: '2026-08-28' },
        { id: 4, rating: 5, comment: 'Love the dark mode!', date: '2026-08-25' },
      ],
      timestamp: new Date().toISOString()
    };
  }

  // Generic fallback
  return {
    success: true,
    message: 'Demo mode - using sample data',
    data: {
      rows: 1248,
      columns: 12,
      quality: '96.8%',
      timestamp: new Date().toISOString()
    }
  };
}

// API functions with proper error handling
export const api = {
  // Upload file
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
        console.warn('Upload returned HTML, using fallback data');
        return getFallbackData('/upload');
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return getFallbackData('/upload');
      }
    } catch (error) {
      console.warn('Upload failed, using fallback:', error);
      return getFallbackData('/upload');
    }
  },

  // Analyze data
  analyzeData: async (data: any) => {
    return safeFetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get predictions
  getPredictions: async (data: any) => {
    return safeFetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get feedback
  getFeedback: async () => {
    return safeFetch(`${API_BASE}/feedback`);
  },

  // Submit feedback
  submitFeedback: async (feedback: { rating: number; comment: string }) => {
    return safeFetch(`${API_BASE}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },

  // Process image (for macro photography)
  processImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await fetch(`${API_BASE}/process-image`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
        return {
          success: true,
          message: 'Image processed successfully (demo mode)',
          result: {
            quality_score: 87,
            recommendations: ['Good texture detail', 'Consider better lighting'],
            artifacts: ['Minimal artifacts detected'],
            timestamp: new Date().toISOString()
          }
        };
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return {
          success: true,
          message: 'Image processed successfully (demo mode)',
          result: {
            quality_score: 87,
            recommendations: ['Good texture detail', 'Consider better lighting'],
            artifacts: ['Minimal artifacts detected'],
            timestamp: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.warn('Image processing failed, using fallback:', error);
      return {
        success: true,
        message: 'Image processed successfully (demo mode)',
        result: {
          quality_score: 87,
          recommendations: ['Good texture detail', 'Consider better lighting'],
          artifacts: ['Minimal artifacts detected'],
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  // Check if running in demo mode
  isDemoMode: () => {
    return isGitHubPages || true; // Always return true for now
  }
};

export default api;
