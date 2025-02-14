// src/services/storageService.ts

import { times } from "lodash";

interface UserInfo {
    age: number;
    location: string;
    studyingFor: string;
  }
  
  interface TestResult {
    topic: string;
    examType: 'JEE' | 'NEET';
    score: number;
    predictedRank: number;
    date: string;
  }
  
  interface UserProgress {
    level: number;
    streak: number;
    bestStreak: number;
    totalQuestions: number;
    correctAnswers: number;
    testResults: TestResult[];
    lastActive: string;
  }
  
  class StorageService {
    private readonly USER_INFO_KEY = 'edu_ai_user_info';
    private readonly PROGRESS_KEY = 'edu_ai_progress';
    private readonly HISTORY_KEY = 'search-history';
  
    constructor() {
      // Initialize if needed
    }
  
    // User Info Methods
    saveUserInfo(info: UserInfo): void {
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(info));
    }
  
    getUserInfo(): UserInfo | null {
      const data = localStorage.getItem(this.USER_INFO_KEY);
      return data ? JSON.parse(data) : null;
    }
  
    hasUser(): boolean {
      return !!this.getUserInfo();
    }
  
    // Progress Methods
    saveProgress(progress: UserProgress): void {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    }
  
    getProgress(): UserProgress {
      const data = localStorage.getItem(this.PROGRESS_KEY);
      return data ? JSON.parse(data) : {
        level: 1,
        streak: 0,
        bestStreak: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        testResults: [],
        lastActive: new Date().toISOString()
      };
    }
  
    updateProgress(updates: Partial<UserProgress>): void {
      const current = this.getProgress();
      this.saveProgress({ ...current, ...updates });
    }
  
    // Test Result Methods
    addTestResult(result: TestResult): void {
      const progress = this.getProgress();
      progress.testResults.push(result);
      this.saveProgress(progress);
    }
  
    getTestResults(): TestResult[] {
      return this.getProgress().testResults;
    }
  
    // History Methods
    addToHistory(topic: string, metadata?: {type ?: string; 
      context?: string}): void {
      const history = this.getHistory();
      const newEntry = {
        topic,
        timestamp: new Date().toISOString(),
        type: metadata?.type || 'search',
        context: metadata?.context || '',
        id: this.generateId()
      }
    
      const filteredHistory = history.filter(item => item.topic !== topic);
      filteredHistory.unshift(newEntry);

      // Keep only last 50 items
      if (history.length > 50) {
        history.pop();
      }
      
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filteredHistory));
    }
  
    getHistory(): Array<{ topic: string;
      timestamp: string;
      type?: string;
      context?: string;
      id: string;
    }> {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    }

    removeFromHistory(id: string): void {
      const history = this.getHistory();
      const filteredHistory = history.filter(item => item.id !== id);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filteredHistory));
    }

    searchHistory(query: string): Array<{
      topic: string;
      timestamp: string;
      type?: string;
      context?: string;
      id: string;
    }> {
      const history = this.getHistory();
      return history.filter(item => 
        item.topic.toLowerCase().includes(query.toLowerCase()) ||
        (item.context && item.context.toLowerCase().includes(query.toLowerCase()))
      );
    }

    private generateId(): string {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  

    clearHistory(): void {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify([]));
    }


    safeSaveUserInfo(info: UserInfo): void {
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(info));
    }
  
    // Utility Methods
    clearAll(): void {
      localStorage.removeItem(this.USER_INFO_KEY);
      localStorage.removeItem(this.PROGRESS_KEY);
      localStorage.removeItem(this.HISTORY_KEY);
    }
  }
  

  // Create and export a single instance
  export const storageService = new StorageService();
  export default storageService;
