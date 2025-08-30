'use client';

import { useState, useEffect } from 'react';

interface ClickCountersProps {
  userClicks: number;
  globalClicks: number;
  onReset?: () => void;
}

export default function ClickCounters({ userClicks, globalClicks, onReset }: ClickCountersProps) {
  const [animateUser, setAnimateUser] = useState(false);
  const [animateGlobal, setAnimateGlobal] = useState(false);
  const [prevUserClicks, setPrevUserClicks] = useState(userClicks);
  const [prevGlobalClicks, setPrevGlobalClicks] = useState(globalClicks);

  // Animate when counts change
  useEffect(() => {
    if (userClicks > prevUserClicks) {
      setAnimateUser(true);
      setTimeout(() => setAnimateUser(false), 600);
    }
    setPrevUserClicks(userClicks);
  }, [userClicks, prevUserClicks]);

  useEffect(() => {
    if (globalClicks > prevGlobalClicks) {
      setAnimateGlobal(true);
      setTimeout(() => setAnimateGlobal(false), 600);
    }
    setPrevGlobalClicks(globalClicks);
  }, [globalClicks, prevGlobalClicks]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
      {/* User Clicks Counter */}
      <div className={`relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 shadow-lg min-w-[200px] transition-all duration-300 ${animateUser ? 'scale-110 shadow-xl' : ''}`}>
        <div className="text-center">
          <div className="text-white/80 text-sm font-medium mb-1">Your Clicks</div>
          <div className={`text-2xl font-bold text-white transition-all duration-300 ${animateUser ? 'scale-125' : ''}`}>
            {formatNumber(userClicks)}
          </div>
          <div className="text-white/60 text-xs mt-1">👤 Personal Count</div>
        </div>
        
        {/* Celebration animation */}
        {animateUser && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-ping">
              ✨
            </div>
          </div>
        )}
      </div>

      {/* VS Divider */}
      <div className="text-2xl font-bold text-gray-400 px-4 hidden sm:block">
        VS
      </div>

      {/* Global Clicks Counter */}
      <div className={`relative bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 shadow-lg min-w-[200px] transition-all duration-300 ${animateGlobal ? 'scale-110 shadow-xl' : ''}`}>
        <div className="text-center">
          <div className="text-white/80 text-sm font-medium mb-1">Global Clicks</div>
          <div className={`text-2xl font-bold text-white transition-all duration-300 ${animateGlobal ? 'scale-125' : ''}`}>
            {formatNumber(globalClicks)}
          </div>
          <div className="text-white/60 text-xs mt-1">🌍 Everyone&apos;s Count</div>
        </div>
        
        {/* Celebration animation */}
        {animateGlobal && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-ping">
              🎉
            </div>
          </div>
        )}
      </div>

      {/* Reset Button (for admin/testing) */}
      {onReset && (
        <button
          onClick={onReset}
          className="ml-4 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
          title="Reset your personal counter"
        >
          🔄 Reset
        </button>
      )}
    </div>
  );
}