export const CSV_ENDPOINTS = {
  grammarPoints:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVRtxu8NCcv04qR_5yNY-lUaUqkzLTKouAoDI5vgh31AX6VRKxmjsMr9wgzDAvg_Qht3kCKE8VOUvU/pub?gid=253795148&single=true&output=csv',
  practiceItems:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVRtxu8NCcv04qR_5yNY-lUaUqkzLTKouAoDI5vgh31AX6VRKxmjsMr9wgzDAvg_Qht3kCKE8VOUvU/pub?gid=617041161&single=true&output=csv',
};

export const CACHE_KEYS = {
  grammar: 'grammar_points_cache_v1',
  practice: 'practice_items_cache_v1',
  attempts: 'practice_attempts_v1',
};

export const REVALIDATE_MS = 5 * 60 * 1000;
