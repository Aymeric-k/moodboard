import type { FilterState } from '../types/FilterState';
import { useFilterStore } from "../stores/filterStore";
import type { WorkCategory } from '../types/WorkType';

interface FilterControlsProps {
  categories: WorkCategory[];
}

export default function FilterControls({ categories }: FilterControlsProps) {
  const { filters, setFilters, resetAllFilters } = useFilterStore();
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ status: e.target.value as FilterState['status'] });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ category: e.target.value as FilterState['category'] });
  };

  const handleFavoriteToggle = () => {
    setFilters({ isFavorite: !filters.isFavorite });
  };

  return (
    <div className="w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 flex flex-col gap-4">
      {/* Status Filter */}
      <div className="flex flex-col">
        <label htmlFor="status-filter" className="text-xs text-slate-400 mb-1">Status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={handleStatusChange}
          className="bg-slate-700 text-white rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="backlog">Backlog</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col">
        <label htmlFor="category-filter" className="text-xs text-slate-400 mb-1">Category</label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={handleCategoryChange}
          className="bg-slate-700 text-white rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Favorite Filter */}
      <div className="flex items-center pt-2 border-t border-slate-700/50">
        <button
          onClick={handleFavoriteToggle}
          aria-pressed={filters.isFavorite}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-colors ${
            filters.isFavorite ? 'bg-yellow-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium">Favorites</span>
        </button>
      </div>

      {/* Reset Filters Button */}
      <div className="flex items-center pt-3 border-t border-slate-700/50">
        <button
          onClick={resetAllFilters}
          className="w-full text-center px-4 py-1.5 rounded-md transition-colors bg-slate-700 text-slate-300 hover:bg-slate-600 text-sm font-medium"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
