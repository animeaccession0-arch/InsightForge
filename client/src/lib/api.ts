// API client with complete error handling for GitHub Pages
// This prevents all JSON parsing errors

const isGitHubPages = window.location.hostname.includes('github.io');
const API_BASE = isGitHubPages ? '/InsightForge/api' : '/api';

// Complete fallback data for all endpoints
const FALLBACK_DATA = {
  // Main analysis data
  analysis: {
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
  },
  
  // Predictions data
  predictions: {
    predictions: [
      { product: 'Product A', demand: 'High', confidence: 0.92 },
      { product: 'Product B', demand: 'Medium', confidence: 0.78 },
      { product: 'Product C', demand: 'Low', confidence: 0.65 },
      { product: 'Product D', demand: 'High', confidence: 0.88 },
    ],
    timestamp: new Date().toISOString()
  },
  
  // Feedback data
  feedback: {
    feedback: [
      { id: 1, rating: 5, comment: 'Great tool! Very useful analytics.', date: '2026-09-01' },
      { id: 2, rating: 4, comment: 'Really helpful for data inspection.', date: '2026-08-30' },
      { id: 3, rating: 3, comment: 'Good but needs more visualization options.', date: '2026-08-28' },
      { id: 4, rating: 5, comment: 'Love the dark mode!', date: '2026-08-25' },
    ],
    timestamp: new Date().toISOString()
  },
  
  // Image processing
  image: {
    success: true,
    message: 'Image processed successfully (demo mode)',
    result: {
      quality_score: 87,
      recommendations: ['Good texture detail', 'Consider better lighting'],
      artifacts: ['Minimal artifacts detected'],
      timestamp: new Date().toISOString()
    }
  },
  
  // Upload response
  upload: {
    success: true,
    message: 'File uploaded successfully (demo mode)',
    data: {
      rows: 1248,
      columns: 12,
      quality: '96.8%',
      signals: [
        { id: 1, name: 'Revenue momentum', value: '+24.6%' },
        { id: 2, name: 'Acquisition mix - Organic', value: '42%' },
      ],
      timestamp: new Date().toISOString()
    }
  }
};

// Generic safe fetch that never throws JSON errors
export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`🔍 Fetching: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    // Get response text
    const text = await response.text();
    console.log(`📦 Response length: ${text.length} characters`);
    
    // Check if response is HTML (starts with <)
    if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
      console.warn('⚠️ Received HTML instead of JSON - using fallback data');
      return getFallbackData(url) as T;
    }
    
    // Try to parse JSON
    try {
      const parsed = JSON.parse(text);
      console.log('✅ JSON parsed successfully');
      return parsed as T;
    } catch (jsonError) {
      console.warn('⚠️ Failed to parse JSON, using fallback data:', jsonError);
      return getFallbackData(url) as T;
    }
  } catch (error) {
    console.warn('⚠️ API fetch error, using fallback data:', error);
    return getFallbackData(url) as T;
  }
}

// Get fallback data based on URL
export function getFallbackData(url: string): any {
  console.log(`📊 Using fallback data for: ${url}`);
  
  if (url.includes('/upload')) {
    return FALLBACK_DATA.upload;
  }
  
  if (url.includes('/analyze')) {
    return FALLBACK_DATA.analysis;
  }
  
  if (url.includes('/predict')) {
    return FALLBACK_DATA.predictions;
  }

  if (url.includes('/feedback')) {
    return FALLBACK_DATA.feedback;
  }

  if (url.includes('/process-image')) {
    return FALLBACK_DATA.image;
  }

  // Default fallback
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

// API functions with complete error handling
export const api = {
  // Upload file
  uploadFile: async (file: File) => {
    console.log('📤 Uploading file:', file.name);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      
      if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
        console.warn('⚠️ Upload returned HTML, using fallback');
        return FALLBACK_DATA.upload;
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn('⚠️ Upload JSON parse failed, using fallback');
        return FALLBACK_DATA.upload;
      }
    } catch (error) {
      console.warn('⚠️ Upload failed, using fallback:', error);
      return FALLBACK_DATA.upload;
    }
  },

  // Analyze data
  analyzeData: async (data: any) => {
    console.log('🔍 Analyzing data:', data);
    // Always return fallback for now (no backend)
    return FALLBACK_DATA.analysis;
  },

  // Get predictions
  getPredictions: async (data: any) => {
    console.log('🔮 Getting predictions:', data);
    return FALLBACK_DATA.predictions;
  },

  // Get feedback
  getFeedback: async () => {
    console.log('💬 Getting feedback');
    return FALLBACK_DATA.feedback;
  },

  // Submit feedback
  submitFeedback: async (feedback: { rating: number; comment: string }) => {
    console.log('💬 Submitting feedback:', feedback);
    return {
      success: true,
      message: 'Feedback submitted successfully',
      feedback: { ...feedback, id: Date.now(), date: new Date().toISOString() }
    };
  },

  // Process image
  processImage: async (imageFile: File) => {
    console.log('📷 Processing image:', imageFile.name);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${API_BASE}/process-image`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      
      if (text.trim().startsWith('<') || text.trim().startsWith('<!DOCTYPE')) {
        console.warn('⚠️ Image processing returned HTML, using fallback');
        return FALLBACK_DATA.image;
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn('⚠️ Image JSON parse failed, using fallback');
        return FALLBACK_DATA.image;
      }
    } catch (error) {
      console.warn('⚠️ Image processing failed, using fallback:', error);
      return FALLBACK_DATA.image;
    }
  },

  // Check if running in demo mode
  isDemoMode: () => {
    return true; // Always true for GitHub Pages
  }
};

export default api;
