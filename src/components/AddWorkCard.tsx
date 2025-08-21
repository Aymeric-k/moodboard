import { useState, useEffect } from 'react';
import type { MoodType } from '../types/MoodType';
import type { WorkType } from '../types/WorkType';
import { SMART_TAGS, type SmartTag } from '../types/SmartTag';
import { useWorkStore } from '../stores/workStore.ts';
import { motion } from 'framer-motion';
// We create a specific type for the form data, excluding fields that are generated automatically.
type WorkFormData = Omit<WorkType, 'id' | 'createdAtISO' | 'status' | 'progress' | 'completedAtISO'>;

interface AddWorkCardProps {
  moods: MoodType[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};


const initialFormState: WorkFormData = {
  title: '',
  category: 'other',
  imageUrl: '',
  moodId: [],
  smartTags: [],
};

function AddWorkCard({ moods }: AddWorkCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<WorkFormData>(initialFormState);
  const { addWork } = useWorkStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleMoodToggle = (moodId: number) => {
    setFormData(prev => {
      const newMoodIds = prev.moodId.includes(moodId)
        ? prev.moodId.filter(id => id !== moodId)
        : [...prev.moodId, moodId];
      return { ...prev, moodId: newMoodIds };
    });
  };

  const handleSmartTagToggle = (tag: SmartTag) => {
    setFormData(prev => {
      const newTags = new Set(prev.smartTags || []);
      newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
      return { ...prev, smartTags: Array.from(newTags) };
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
        alert("Please fill in at least the title and image URL.");
        return;
    }
    addWork(formData);
    setFormData(initialFormState); // Reset form
    setIsExpanded(false); // Collapse card
  };

  if (!isExpanded) {
    return (
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onClick={() => setIsExpanded(true)}
        className="w-72 h-[420px] bg-slate-800/50 border-4 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-800/80 hover:border-slate-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-72 bg-slate-800 rounded-lg shadow-xl flex flex-col overflow-hidden border-4 border-blue-500"
    >
      <form onSubmit={handleSubmit} className="p-4 flex flex-col flex-grow gap-3">
        <h2 className="text-xl font-bold text-white text-center mb-2">Add New Work</h2>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} className="bg-slate-700 text-white placeholder-slate-400 rounded p-2 w-full" required />
        <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleInputChange} className="bg-slate-700 text-white placeholder-slate-400 rounded p-2 w-full" required />

        <select name="category" value={formData.category} onChange={handleInputChange} className="bg-slate-700 text-white rounded p-2 w-full">
          <option value="book">Book</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="video-game">Video Game</option>
          <option value="music">Music</option>
          <option value="other">Other</option>
        </select>

        {/* The progress tracking inputs have been removed for simplicity */}

        <div className="mt-2 border-t border-slate-700 pt-3">
          <p className="text-sm text-slate-400 mb-2 text-center">Associated Moods:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {moods.map(mood => {
              const isSelected = formData.moodId.includes(mood.id);
              return (
                <button
                  type="button"
                  key={mood.id}
                  onClick={() => handleMoodToggle(mood.id)}
                  aria-pressed={isSelected}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    isSelected ? 'bg-yellow-400 text-slate-900 font-bold scale-105' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {mood.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section to edit Smart Tags */}
        <div className="mt-2 border-t border-slate-700 pt-3">
          <p className="text-sm text-slate-400 mb-2 text-center">Smart Tags:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SMART_TAGS.map(tag => {
              const isSelected = formData.smartTags?.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleSmartTagToggle(tag)}
                  aria-pressed={isSelected}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    isSelected ? 'bg-purple-500 text-white font-bold scale-105' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {tag.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => setIsExpanded(false)} className="px-4 py-1 bg-slate-600 rounded text-white">Cancel</button>
          <button type="submit" className="px-4 py-1 bg-green-600 rounded text-white">Add</button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddWorkCard;
