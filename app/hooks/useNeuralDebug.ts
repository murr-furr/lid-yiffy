import { useEffect, useRef } from "react";

export function useNeuralDebug(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;

    // Log only if duration is significant to avoid noise
    if (duration > 5) {
        console.log(`[Neural Debug] ${componentName} render #${renderCount.current} took ${duration.toFixed(2)}ms`);
    }

    renderCount.current++;
    startTime.current = performance.now();
  });
}
