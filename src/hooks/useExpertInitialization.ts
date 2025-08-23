import { useEffect } from 'react';
import { useExpertStore } from '../stores/expertStore';
import { sampleExperts, sampleExpertPicks } from '../data/sampleExperts';

// Global flag to ensure initialization happens only once across all renders
let globalInitialized = false;

export const useExpertInitialization = () => {
  const { experts, expertPicks } = useExpertStore();

  useEffect(() => {
    // Only initialize once globally
    if (globalInitialized) {
      return;
    }

    console.log('🚀 Initializing expert data...');

    // Get store actions directly to avoid dependency issues
    const store = useExpertStore.getState();

    // Add all sample experts
    sampleExperts.forEach(expert => {
      store.addExpert(expert);
    });

    // Add all sample expert picks
    sampleExpertPicks.forEach(pick => {
      store.addExpertPick(pick);
    });

    globalInitialized = true;
    console.log(`✅ Expert data initialized: ${sampleExperts.length} experts, ${sampleExpertPicks.length} picks`);
  }, []); // Empty dependency array since we're using getState()

  return {
    isInitialized: experts.length > 0 && expertPicks.length > 0,
    expertCount: experts.length,
    pickCount: expertPicks.length
  };
};
