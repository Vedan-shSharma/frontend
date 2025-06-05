import axios from 'axios';
import { api, API_URL } from '../config/api';

const CACHE_DURATION = 30000; // 30 seconds cache

// Cache storage
const cache = new Map();

export const fetchWithCache = async (endpoint, forceRefresh = false) => {
  const now = Date.now();
  const cacheKey = endpoint;
  const cachedData = cache.get(cacheKey);

  // Return cached data if available and not expired
  if (!forceRefresh && cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const response = await api.get(`/${endpoint}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    // Update cache
    cache.set(cacheKey, {
      data: response.data,
      timestamp: now
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const invalidateCache = (endpoint) => {
  if (endpoint) {
    cache.delete(endpoint);
  } else {
    cache.clear();
  }
};

export const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    width: '100%',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #4f46e5',
    borderRight: '3px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  refreshBtn: {
    background: '#f1f5f9',
    color: '#4f46e5',
    border: '1px solid #c7d2fe',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'background 0.2s',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}; 
