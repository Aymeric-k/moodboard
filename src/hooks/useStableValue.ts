import { useRef, useEffect } from 'react';

/**
 * Hook to stabilize values and prevent unnecessary re-renders
 * Useful for objects and arrays that might change reference but not content
 */
export function useStableValue<T>(value: T, isEqual: (a: T, b: T) => boolean = Object.is): T {
  const ref = useRef<T>(value);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Hook to stabilize callback functions
 * Prevents child components from re-rendering when parent re-renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useRef((...args: Parameters<T>) => ref.current(...args)).current as T;
}
