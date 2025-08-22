import { Profiler } from 'react';
import type { ProfilerOnRenderCallback, ReactNode } from 'react';

interface PerformanceProfilerProps {
  id: string;
  children: ReactNode;
  onRender?: ProfilerOnRenderCallback;
}

/**
 * PerformanceProfiler component to monitor component render performance
 * Only active in development mode
 */
function PerformanceProfiler({ id, children, onRender }: PerformanceProfilerProps) {
  // Only enable profiling in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return <>{children}</>;
  }

  const defaultOnRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration
  ) => {
    // Log performance data to console
    console.log(`[Performance] ${id}:`, {
      phase,
      actualDuration: `${actualDuration.toFixed(2)}ms`,
      baseDuration: `${baseDuration.toFixed(2)}ms`,
      improvement: `${((baseDuration - actualDuration) / baseDuration * 100).toFixed(1)}%`
    });
  };

  return (
    <Profiler id={id} onRender={onRender || defaultOnRender}>
      {children}
    </Profiler>
  );
}

export default PerformanceProfiler;
