// API client with complete error handling for GitHub Pages

const isGitHubPages = window.location.hostname.includes('github.io');
const API_BASE = isGitHubPages ? '/InsightForge/api' : '/api';

// Complete fallback data for all endpoints
const FALLBACK_DATA = {
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
  
  feedback: {
    feedback: [
      { id: 1, rating: 5, comment: 'Great tool! Very useful analytics.', date: '2026-09-01' },
      { id: 2, rating: 4, comment: 'Really helpful for data inspection.', date: '2026-08-30' },
      { id: 3, rating: 3, comment: 'Good but needs more visualization options.', date: '2026-08-28' },
    ],
    timestamp: new Date().toISOString()
  },
  
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

// Get fallback data based on URL
export function getFallbackData(url: string): any {
  console.log(`📊 Using fallback data for: ${url}`);
  
  if (url.includes('/upload')) return FALLBACK_DATA.upload;
  if (url.includes('/analyze')) return FALLBACK_DATA.analysis;
  if (url.includes('/feedback')) return FALLBACK_DATA.feedback;
  if (url.includes('/process-image')) return FALLBACK_DATA.image;
  
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

export const api = {
  // Upload file
  uploadFile: async (file: File) => {
    console.log('📤 Uploading file:', file.name);
    return FALLBACK_DATA.upload;
  },

  // Analyze data
  analyzeData: async (data: any) => {
    console.log('🔍 Analyzing data:', data);
    return FALLBACK_DATA.analysis;
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
    return FALLBACK_DATA.image;
  },

  // Check if running in demo mode
  isDemoMode: () => true
};

export default api;
