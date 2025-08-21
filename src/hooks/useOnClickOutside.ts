import { useEffect, type RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * A custom hook that triggers a callback when a click is detected outside of the referenced element.
 * @param ref - The ref of the element to detect outside clicks for.
 * @param handler - The function to call when an outside click is detected.
 * @param ignoredRef - An optional ref of an element to ignore clicks on (e.g., the button that opens the menu).
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
  ignoredRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const target = event.target as Node;

      // Do nothing if clicking ref's element or descendent elements
      if (ref.current && ref.current.contains(target)) {
        return;
      }

      // Do nothing if clicking the ignored element (e.g., the toggle button)
      if (ignoredRef?.current && ignoredRef.current.contains(target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, ignoredRef, handler]); // Reload if ref or handler changes
}
