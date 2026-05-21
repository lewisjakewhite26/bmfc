import { useEffect, useState } from 'react';
import {
  getIsPerfLite,
  syncPerformanceProfileClass,
  watchPerformanceProfile,
} from '../utils/performanceProfile';

export function usePerformanceProfile(): boolean {
  const [isLite, setIsLite] = useState(getIsPerfLite);

  useEffect(() => {
    syncPerformanceProfileClass();
    setIsLite(getIsPerfLite());
    return watchPerformanceProfile(() => setIsLite(getIsPerfLite()));
  }, []);

  return isLite;
}
