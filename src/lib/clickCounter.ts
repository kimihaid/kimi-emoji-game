import { ApiResponse, GlobalClickData } from '@/types';

export class ClickCounter {
  private static readonly USER_CLICKS_KEY = 'emoji-sound-user-clicks';
  private static readonly API_BASE = '/api/clicks';

  // Get user's local click count from localStorage
  static getUserClicks(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const stored = localStorage.getItem(this.USER_CLICKS_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.error('Error reading user clicks from localStorage:', error);
      return 0;
    }
  }

  // Increment user's local click count
  static incrementUserClicks(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const current = this.getUserClicks();
      const newCount = current + 1;
      localStorage.setItem(this.USER_CLICKS_KEY, newCount.toString());
      return newCount;
    } catch (error) {
      console.error('Error updating user clicks in localStorage:', error);
      return this.getUserClicks();
    }
  }

  // Reset user's local click count
  static resetUserClicks(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.USER_CLICKS_KEY, '0');
    } catch (error) {
      console.error('Error resetting user clicks in localStorage:', error);
    }
  }

  // Fetch global click count from API
  static async getGlobalClicks(): Promise<number> {
    try {
      const response = await fetch(this.API_BASE);
      const data: ApiResponse<GlobalClickData> = await response.json();
      
      if (data.success && data.data) {
        return data.data.totalClicks;
      } else {
        console.error('Failed to fetch global clicks:', data.error);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching global clicks:', error);
      return 0;
    }
  }

  // Increment global click count via API
  static async incrementGlobalClicks(): Promise<number> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: 1 }),
      });
      
      const data: ApiResponse<GlobalClickData> = await response.json();
      
      if (data.success && data.data) {
        return data.data.totalClicks;
      } else {
        console.error('Failed to increment global clicks:', data.error);
        return await this.getGlobalClicks(); // Fallback to current count
      }
    } catch (error) {
      console.error('Error incrementing global clicks:', error);
      return await this.getGlobalClicks(); // Fallback to current count
    }
  }

  // Reset global click count via API (admin function)
  static async resetGlobalClicks(): Promise<boolean> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'PUT',
      });
      
      const data: ApiResponse<GlobalClickData> = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error resetting global clicks:', error);
      return false;
    }
  }

  // Increment both user and global clicks
  static async incrementBothCounters(): Promise<{ userClicks: number; globalClicks: number }> {
    const userClicks = this.incrementUserClicks();
    const globalClicks = await this.incrementGlobalClicks();
    
    return { userClicks, globalClicks };
  }

  // Get both counters
  static async getBothCounters(): Promise<{ userClicks: number; globalClicks: number }> {
    const userClicks = this.getUserClicks();
    const globalClicks = await this.getGlobalClicks();
    
    return { userClicks, globalClicks };
  }
}