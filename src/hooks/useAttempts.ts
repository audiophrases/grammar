import { useEffect, useState } from 'react';
import { CACHE_KEYS } from '../config';

export interface AttemptState {
  [itemId: string]: {
    attempts: number;
    correct: boolean;
    lastAnswer?: string;
  };
}

const loadAttempts = (): AttemptState => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEYS.attempts) || '{}');
  } catch {
    return {};
  }
};

export const useAttempts = () => {
  const [attempts, setAttempts] = useState<AttemptState>(loadAttempts);

  useEffect(() => {
    localStorage.setItem(CACHE_KEYS.attempts, JSON.stringify(attempts));
  }, [attempts]);

  const record = (itemId: string, correct: boolean, answer?: string) => {
    setAttempts((prev) => ({
      ...prev,
      [itemId]: {
        attempts: (prev[itemId]?.attempts || 0) + 1,
        correct,
        lastAnswer: answer,
      },
    }));
  };

  return { attempts, record };
};
