import { Profiler } from 'react';
import type { ProfilerOnRenderCallback } from 'react';
import { memo } from 'react';

interface PerformanceProfilerProps {
  id: string;
  children: React.ReactNode;
  onRender?: ProfilerOnRenderCallback;
}

const PerformanceProfilerComponent = ({ id, children, onRender }: PerformanceProfilerProps) => {
  const handleRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    // Log performance data to console in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`🔍 [Profiler] ${id}:`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        startTime: `${startTime.toFixed(2)}ms`,
        commitTime: `${commitTime.toFixed(2)}ms`,
        performance: actualDuration > 16 ? '⚠️ Slow (>16ms)' : '✅ Fast'
      });
    }

    // Call custom onRender if provided
    if (onRender) {
      onRender(id, phase, actualDuration, baseDuration, startTime, commitTime);
    }
  };

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
};

export default memo(PerformanceProfilerComponent);
