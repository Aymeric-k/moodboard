import { useRef } from 'react';

/**
 * Hook pour éviter les re-renders causés par des objets créés à chaque render
 */
export function useStableValue<T>(value: T, equalityFn?: (a: T, b: T) => boolean): T {
  const ref = useRef<T | undefined>(undefined);

  if (ref.current === undefined || (equalityFn ? !equalityFn(ref.current, value) : ref.current !== value)) {
    ref.current = value;
  }

  return ref.current;
}
