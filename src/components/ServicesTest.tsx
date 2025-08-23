
import { useWorkStore } from '../stores/workStore';
import { useFilterStore } from '../stores/filterStore';
import { useMoodStore } from '../stores/moodStore';
import { useThemeStore } from '../stores/themeStore';
import { LocalStorageWorkService } from '../services/LocalStorageWorkService';
import { LocalStorageFilterService } from '../services/LocalStorageFilterService';
import { LocalStorageMoodService } from '../services/LocalStorageMoodService';
import { LocalStorageThemeService } from '../services/LocalStorageThemeService';
import { useEffect, useState } from 'react';

export function ServicesTest() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { works, isLoading, error, addWork, initialize: initializeWork } = useWorkStore();
  const { filters, activeSmartTags, isLoading: filtersLoading, error: filtersError, initialize: initializeFilter } = useFilterStore();
  const { historicalEvents, todayMoodsData, isLoading: moodsLoading, error: moodsError, initialize: initializeMood } = useMoodStore();
  const { currentTheme, isLoading: themeLoading, error: themeError, initialize: initializeTheme } = useThemeStore();

  useEffect(() => {
    const initServices = async () => {
      try {
        console.log('🚀 Initializing services...');

        // Initialiser work service
        const workService = new LocalStorageWorkService();
        await initializeWork(workService);
        console.log('✅ Work service initialized successfully');

        // Initialiser filter service
        const filterService = new LocalStorageFilterService();
        await initializeFilter(filterService);
        console.log('✅ Filter service initialized successfully');

        // Initialiser mood service
        const moodService = new LocalStorageMoodService();
        await initializeMood(moodService);
        console.log('✅ Mood service initialized successfully');

        // Initialiser theme service
        const themeService = new LocalStorageThemeService();
        await initializeTheme(themeService);
        console.log('✅ Theme service initialized successfully');

        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Failed to initialize services:', error);
      }
    };

    initServices();
  }, [initializeWork, initializeFilter, initializeMood, initializeTheme]);

  const handleTestAddWork = async () => {
    try {
      await addWork({
        title: 'Test Work via Service',
        category: 'book',
        imageUrl: 'https://example.com/test.jpg',
        moodId: [1, 2],
        smartTags: ['quick'],
        notes: 'Test work created via service layer',
        isFavorite: false,
      });
      console.log('✅ Test work added successfully');
    } catch (error) {
      console.error('❌ Failed to add test work:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="p-4 bg-blue-100 rounded-lg">
        <p className="text-blue-800">🔄 Initializing services...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-green-800">
        ✅ Services Layer Test
      </h3>

      <div className="space-y-2">
        <p className="text-green-700">
          <strong>Status:</strong> {isInitialized ? 'Initialized' : 'Not initialized'}
        </p>
        <p className="text-green-700">
          <strong>Works count:</strong> {works.length}
        </p>
        <p className="text-green-700">
          <strong>Work Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </p>
        {error && (
          <p className="text-green-700">
            <strong>Work Error:</strong> {error}
          </p>
        )}

        <p className="text-green-700">
          <strong>Active Smart Tags:</strong> {activeSmartTags.length}
        </p>
        <p className="text-green-700">
          <strong>Current Filters:</strong> {filters.status}, {filters.category}, {filters.isFavorite ? 'Favorites' : 'All'}, "{filters.searchQuery}"
        </p>
        <p className="text-green-700">
          <strong>Filter Loading:</strong> {filtersLoading ? 'Yes' : 'No'}
        </p>
        {filtersError && (
          <p className="text-green-700">
            <strong>Filter Error:</strong> {filtersError}
          </p>
        )}

        <p className="text-green-700">
          <strong>Historical Events:</strong> {historicalEvents.length}
        </p>
        <p className="text-green-700">
          <strong>Today Moods:</strong> {todayMoodsData.moods.length}
        </p>
        <p className="text-green-700">
          <strong>Mood Loading:</strong> {moodsLoading ? 'Yes' : 'No'}
        </p>
        {moodsError && (
          <p className="text-green-700">
            <strong>Mood Error:</strong> {moodsError}
          </p>
        )}

        <p className="text-green-700">
          <strong>Current Theme:</strong> {currentTheme}
        </p>
        <p className="text-green-700">
          <strong>Theme Loading:</strong> {themeLoading ? 'Yes' : 'No'}
        </p>
        {themeError && (
          <p className="text-green-700">
            <strong>Theme Error:</strong> {themeError}
          </p>
        )}
      </div>

      <button
        onClick={handleTestAddWork}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Test Add Work via Service
      </button>

      <div className="text-sm text-green-600">
        <p>🎯 This component tests the new services layer:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Services are initialized on mount</li>
          <li>WorkStore uses injected WorkService</li>
          <li>FilterStore uses injected FilterService</li>
          <li>MoodStore uses injected MoodService</li>
          <li>All operations go through the service layer</li>
          <li>Ready for future API migration</li>
        </ul>
      </div>
    </div>
  );
}
