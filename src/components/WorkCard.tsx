import type { WorkType } from "../types/WorkType.ts"
import { type SmartTag } from "../types/SmartTag.ts"
import { motion } from "framer-motion"
import type { Recommendation } from '../utils/recommendationUtils.ts';
import type { MoodType } from "../types/MoodType.ts"
import { useWorkStore } from '../stores/workStore.ts';
import { useUIStore } from '../stores/uiStore.ts';
import { useState, useEffect, useCallback, memo } from "react"
import SmartTagSelector from './SmartTagSelector';

const cardVariants = {

  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: "easeOut" } as const
  },
  exit: {
    opacity: 0, y: -20, scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" } as const

  }
};


interface WorkCardProps{
  backlogWork : WorkType
  activeMoods: number[]
  moods: MoodType[];
  isPromptingForProgress: boolean;
  recommendation?: Recommendation;
}



function WorkCardComponent({backlogWork, activeMoods, moods, isPromptingForProgress, recommendation} : WorkCardProps){
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(isPromptingForProgress);
  const [currentProgress, setCurrentProgress] = useState(backlogWork.progress);
  // Local state to manage form changes
  const [editedWork, setEditedWork] = useState(backlogWork);
  // État pour gérer l'interactivité mobile
  const [isMobileFocused, setIsMobileFocused] = useState(false);
  const { updateWork } = useWorkStore();
  const { openDeleteModal, setWorkToPromptForProgress, openNotesModal } = useUIStore();

  /**
   * Determines the correct status of a work based on its progress.
   * @param work The work object, which should have the target progress value.
   * @returns A new work object with the updated status and completion date if necessary.
   */
  const getWorkWithUpdatedStatus = useCallback((work: WorkType): WorkType => {
    const { progress, status } = work;
    let newStatus = status;
    let newCompletedAt = work.completedAtISO;

    if (progress === 100 && status !== 'completed') {
      newStatus = 'completed';
      newCompletedAt = new Date().toISOString();
    } else if (progress > 0 && progress < 100) {
      newStatus = 'in-progress';
      newCompletedAt = undefined;
    } else if (progress === 0 && status !== 'backlog') {
      newStatus = 'backlog';
      newCompletedAt = undefined;
    }

    return { ...work, status: newStatus, completedAtISO: newCompletedAt };
  }, []);

  // Keep local state in sync with props. When the parent component updates
  // the work, the props change, and we need to update our local state to reflect that.
  useEffect(() => {
    setEditedWork(backlogWork);
    setCurrentProgress(backlogWork.progress);
  }, [backlogWork]);

  // Sync with the prompt prop from the parent
  useEffect(() => {
    setIsUpdatingProgress(isPromptingForProgress);
  }, [isPromptingForProgress]);

  // Determines the border color based on match quality.
  const getBorderColor = useCallback(() => {
    if (activeMoods.length === 0) {
      return 'border-slate-600'; // Default border if no filter is active
    }
    // .every() checks if ALL elements in the array pass the test.
    const isPerfectMatch = activeMoods.every(id => backlogWork.moodId.includes(id));

    if (isPerfectMatch) {
      return 'border-green-400 shadow-green-400/30'; // Green border for a perfect match
    }
    return 'border-yellow-400 shadow-yellow-400/30'; // Yellow border for a partial match
  }, [activeMoods, backlogWork.moodId]);

  const handleSave = useCallback(() => {
    const finalWork = getWorkWithUpdatedStatus(editedWork);
    updateWork(finalWork);
    setIsEditing(false);
  }, [editedWork, getWorkWithUpdatedStatus, updateWork]);

  const handleCancel = useCallback(() => {
    setEditedWork(backlogWork); // Resets unsaved changes
    setIsEditing(false);
  }, [backlogWork]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // The slider value is a string, convert it to a number for 'progress'
    const processedValue = name === 'progress' ? Number(value) : value;

    setEditedWork(prev => ({ ...prev, [name]: processedValue }));
  }, []);

  const handleStartWork = useCallback(() => {
    // Met à jour le statut de l'œuvre et le passe au parent
    updateWork({ ...backlogWork, status: 'in-progress' });
  }, [backlogWork, updateWork]);

  const handleUpdateProgress = useCallback(() => {
    const workWithNewProgress = { ...backlogWork, progress: currentProgress };
    updateWork(getWorkWithUpdatedStatus(workWithNewProgress));
    // Notify the parent that the prompt has been resolved.
    localStorage.removeItem('moodboard-last-interacted-work-id');
    setWorkToPromptForProgress(null);
    setIsUpdatingProgress(false);
  }, [backlogWork, currentProgress, getWorkWithUpdatedStatus, updateWork, setWorkToPromptForProgress]);

  const handleCancelProgressUpdate = useCallback(() => {
    // Reset local progress state and exit update mode
    setCurrentProgress(backlogWork.progress);
    // Also notify the parent that the prompt is resolved.
    localStorage.removeItem('moodboard-last-interacted-work-id');
    setWorkToPromptForProgress(null);
    setIsUpdatingProgress(false);
  }, [backlogWork.progress, setWorkToPromptForProgress]);

  const handleMoodToggle = useCallback((moodId: number) => {
    setEditedWork(prev => {
      const newMoodIds = prev.moodId.includes(moodId)
        ? prev.moodId.filter(id => id !== moodId)
        : [...prev.moodId, moodId];
      return { ...prev, moodId: newMoodIds };
    });
  }, []);

  const handleSmartTagToggle = useCallback((tag: SmartTag) => {
    setEditedWork(prev => {
      const currentTags = prev.smartTags || [];
      const newTags = new Set(currentTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else { newTags.add(tag); }
      return { ...prev, smartTags: Array.from(newTags) };
    });
  }, []);

  const handleToggleFavorite = useCallback(() => {
    updateWork({ ...backlogWork, isFavorite: !backlogWork.isFavorite });
  }, [backlogWork, updateWork]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleDeleteClick = useCallback(() => {
    openDeleteModal(backlogWork.id);
  }, [backlogWork.id, openDeleteModal]);

  const handleNotesModalOpen = useCallback(() => {
    openNotesModal(backlogWork.id);
  }, [backlogWork.id, openNotesModal]);

  const handleProgressUpdateClick = useCallback(() => {
    setIsUpdatingProgress(true);
  }, []);

  // Gestionnaires pour l'interactivité mobile
  const handleMobileFocus = useCallback(() => {
    // Seulement sur mobile, pas sur desktop
    if (window.innerWidth < 768) {
      setIsMobileFocused(true);
    }
  }, []);

  const handleMobileBlur = useCallback(() => {
    // Seulement sur mobile
    if (window.innerWidth < 768) {
      // Délai pour permettre le clic sur les boutons
      setTimeout(() => setIsMobileFocused(false), 200);
    }
  }, []);

  const handleMobileTouch = useCallback(() => {
    // Seulement sur mobile
    if (window.innerWidth < 768) {
      setIsMobileFocused(true);
      // Auto-hide après 3 secondes sur mobile
      setTimeout(() => setIsMobileFocused(false), 3000);
    }
  }, []);

  return (

    <motion.div
      layout
      variants={cardVariants}
      // 1. Add `relative` so icons can be positioned relative to the card.
      // 2. Add `group` to enable the `group-hover` pattern.
      className={`relative group w-72 ${isEditing ? 'h-auto min-h-[520px]' : 'h-auto min-h-[480px]'} bg-slate-800 rounded-lg shadow-xl flex flex-col overflow-hidden border-4 ${getBorderColor()} transition-all duration-300`}
      onTouchStart={handleMobileTouch}
      onFocus={handleMobileFocus}
      onBlur={handleMobileBlur}
      tabIndex={0}
    >
      {/* Recommendation Score Badge with Tooltip */}
      {recommendation && (
        <div className="absolute top-2 left-2 z-20 group/tooltip">
          <div className="bg-slate-900/80 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
            ✨ {recommendation.score}
          </div>
          {/* Tooltip Content */}
          <div className="absolute top-full left-0 mt-2 w-56 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-left opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none">
            <h4 className="font-bold text-sm text-white mb-1">Recommendation Score</h4>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
              {recommendation.breakdown.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
            <div className="mt-2 pt-1 border-t border-slate-700/50 text-right">
              <span className="font-bold text-white">Total: {recommendation.score}</span>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute bottom-full left-3 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-slate-900"></div>
          </div>
        </div>

      )}
      {/* Action icons container - Séparé mobile/desktop */}
      {/* Version Mobile - Visible uniquement après focus */}
      <div className={`absolute top-2 right-2 flex gap-2 transition-opacity duration-300 z-20 md:hidden ${
        isMobileFocused ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={handleToggleFavorite}
          className="p-2.5 bg-yellow-900/70 rounded-full hover:bg-yellow-800 cursor-pointer transition-all flex items-center justify-center"
          title="Toggle Favorite"
          aria-label={backlogWork.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {/* Favorite Icon (Star) - Version simplifiée pour éviter la déformation */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 text-yellow-400 ${backlogWork.isFavorite ? 'fill-current' : 'fill-none'}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
        <button
          onClick={handleEditClick}
          className="p-2.5 bg-blue-900/70 rounded-full hover:bg-blue-800 cursor-pointer transition-all flex items-center justify-center"
          title="Edit"
          aria-label="Edit work"
        >
          {/* Edit Icon (Pencil) - Taille fixe pour éviter la déformation */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-2.5 bg-red-900/70 rounded-full hover:bg-red-800 cursor-pointer transition-all flex items-center justify-center"
          title="Delete"
          aria-label="Delete work"
        >
          {/* Delete Icon (Trash) - Taille fixe pour éviter la déformation */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Version Desktop - Visible uniquement au hover */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden md:flex">
        <button
          onClick={handleToggleFavorite}
          className="p-1.5 bg-yellow-900/70 rounded-full hover:bg-yellow-800 cursor-pointer transition-all flex items-center justify-center"
          title="Toggle Favorite"
          aria-label={backlogWork.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {/* Favorite Icon (Star) - Taille desktop */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-yellow-400"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
        <button
          onClick={handleEditClick}
          className="p-1.5 bg-blue-900/70 rounded-full hover:bg-blue-800 cursor-pointer transition-all flex items-center justify-center"
          title="Edit"
          aria-label="Edit work"
        >
          {/* Edit Icon (Pencil) - Taille desktop */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1.5 bg-red-900/70 rounded-full hover:bg-red-800 cursor-pointer transition-all flex items-center justify-center"
          title="Delete"
          aria-label="Delete work"
        >
          {/* Delete Icon (Trash) - Taille desktop */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>


      <div className="relative h-80 flex-shrink-0 bg-slate-900">
        {/* --- Logique d'affichage de l'image --- */}
        {backlogWork.status === 'backlog' ? (
          // Pour les œuvres "backlog", on affiche une image normale en couleur.
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={backlogWork.imageUrl}
            alt={`Cover for ${backlogWork.title}`}
          />
        ) : (
          // Pour les autres statuts, on utilise l'effet de progression coloré/gris.
          <>
            <img
              className="absolute inset-0 w-full h-full object-cover grayscale"
              src={backlogWork.imageUrl}
              alt=""
              aria-hidden="true"
            />
            <img
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
              style={{ clipPath: `inset(0 ${100 - backlogWork.progress}% 0 0)` }}
              src={backlogWork.imageUrl}
              alt={`Cover for ${backlogWork.title}`}
            />
          </>
        )}

        {/* --- Superpositions et éléments interactifs --- */}
        {backlogWork.status === 'backlog' && (
          // A single overlay for both background, blur, and content.
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity ease-out duration-500 z-10 ${
            isMobileFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <button onClick={handleStartWork} className="px-6 py-3 bg-blue-600/90 text-white rounded-md hover:bg-blue-500 transition-colors shadow-lg">Dive In!</button>
          </div>
        )}

        {backlogWork.status === 'in-progress' && !isUpdatingProgress && !isEditing && (
          // The overlay is now triggered by group-hover, just like the "Dive In!" button.
          // It's invisible by default and appears on hover. This solves the bug where the prompt
          // would reappear immediately after saving/cancelling a progress update.
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer z-20 transition-opacity duration-300 ${
            isMobileFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
            onClick={handleProgressUpdateClick}>
            <div className="flex flex-col items-center text-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="mt-2 font-semibold">Update Progress</span>
            </div>
          </div>
        )}
      </div>


      <div className="p-4 flex flex-col flex-grow text-center justify-center">
        {isEditing ? ( // EDITING MODE
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="title"
              value={editedWork.title}
              onChange={handleInputChange}
              className="bg-slate-700 text-white text-center text-xl font-bold rounded p-1"
            />
            <input
              type="text" name="imageUrl" value={editedWork.imageUrl} onChange={handleInputChange} className="bg-slate-700 text-white text-center text-xs rounded p-1 mt-1" placeholder="Image URL" />

            <textarea
              name="notes"
              value={editedWork.notes || ''}
              onChange={handleInputChange}
              placeholder="Personal notes..."
              className="bg-slate-700 text-white text-sm rounded p-2 mt-1 w-full h-20 resize-none"
            />

            <select name="category" value={editedWork.category} onChange={handleInputChange} className="bg-slate-700 text-white rounded p-2 w-full mt-1">
              <option value="book">Book</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="video-game">Video Game</option>
              <option value="music">Music</option>
              <option value="other">Other</option>
            </select>

            {/* Progress Slider in Edit Mode */}
            <div className="mt-2">
              <label htmlFor="edit-progress" className="text-sm text-slate-400 mb-1 block">Progress: <span className="font-bold text-white">{editedWork.progress}%</span></label>
              <input
                id="edit-progress"
                type="range"
                name="progress"
                min="0"
                max="100"
                value={editedWork.progress}
                onChange={handleInputChange}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            {/* Section to edit moods */}
            <div className="border-t border-slate-700 pt-3">
              <p className="text-sm text-slate-400 mb-2">Associated Moods:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {moods.map(mood => {
                  const isSelected = editedWork.moodId.includes(mood.id);
                  return (
                                         <button
                       type="button"
                       key={mood.id}
                       aria-pressed={isSelected}
                       onClick={() => handleMoodToggle(mood.id)}
                       className={`px-3 py-2 sm:px-2 sm:py-1 text-sm sm:text-xs rounded-full transition-all ${
                         isSelected ? 'bg-yellow-400 text-slate-900 font-bold scale-105' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                       }`}
                     >
                      {mood.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Section to edit Smart Tags */}
            <div className="mt-3 border-t border-slate-700 pt-3">
              <p className="text-sm text-slate-400 mb-2">Smart Tags:</p>
              <SmartTagSelector
                activeTags={editedWork.smartTags || []}
                onTagToggle={handleSmartTagToggle}
                className="max-h-24 overflow-y-auto"
              />
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <button onClick={handleSave} className="px-6 py-2 sm:px-4 sm:py-1 bg-green-600 rounded text-white text-sm sm:text-base">Save</button>
              <button onClick={handleCancel} className="px-6 py-2 sm:px-4 sm:py-1 bg-slate-600 rounded text-white text-sm sm:text-base">Cancel</button>
            </div>
          </div>
        ) : isUpdatingProgress ? ( // PROGRESS UPDATE MODE
          <div className="flex flex-col items-center justify-center h-full">
            <label htmlFor="progress" className="text-slate-300 mb-2">How far are you? <span className="font-bold text-white">{currentProgress}%</span></label>
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={currentProgress}
              onChange={(e) => setCurrentProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={handleCancelProgressUpdate} className="px-6 py-2 sm:px-4 sm:py-1 bg-slate-600 rounded text-white text-sm">Cancel</button>
              <button onClick={handleUpdateProgress} className="px-6 py-2 sm:px-4 sm:py-1 bg-blue-600 rounded text-white text-sm">Save</button>
            </div>
          </div>
        ) : ( // DISPLAY MODE
          <>
            <h2 className="text-xl font-bold text-gray-100">{backlogWork.title}</h2>
            <p className="text-md text-gray-400 mt-1 capitalize">{backlogWork.category.replace('-', ' ')}</p>

            <div className="mt-3">
              {backlogWork.notes ? (
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-300 text-left italic border-l-2 border-slate-600 pl-3 flex-1 max-h-32 overflow-y-auto">
                    {backlogWork.notes.length > 150
                      ? `${backlogWork.notes.substring(0, 150)}...`
                      : backlogWork.notes
                    }
                  </p>
                  <button
                    onClick={handleNotesModalOpen}
                    className="text-slate-400 hover:text-white hover:bg-slate-700 p-3 sm:p-2 rounded transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title={backlogWork.notes.length > 150 ? "View full notes" : "Edit notes"}
                    aria-label={backlogWork.notes.length > 150 ? "View full notes" : "Edit notes"}
                  >
                    <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 italic">No notes yet</p>
                  <button
                    onClick={handleNotesModalOpen}
                    className="text-slate-400 hover:text-white hover:bg-slate-700 p-3 sm:p-2 rounded transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Add notes"
                    aria-label="Add notes"
                  >
                    <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {backlogWork.status === 'completed' ? (
              <div className="mt-4 text-green-400 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>Completed</span>
              </div>
                         ) : null}

                         <div className="flex flex-wrap gap-1.5 justify-center pt-4">
              {backlogWork.moodId
                .map(id => moods.find(m => m.id === id)) // Find the corresponding mood objects
                .filter(Boolean) // Filter out any unfound moods
                .map(mood => {
                  // Derive a lighter text color from the mood's background color
                  const textColorClass = mood!.color
                    .replace('bg-', 'text-')
                    .replace('300', '200')
                    .replace('400', '200')
                    .replace('500', '300');

                  // Combine background color, its opacity, and text color for the badge
                  return <span key={mood!.id} className={`text-sm sm:text-xs font-semibold px-3 py-1 sm:px-2 sm:py-0.5 rounded-full ${mood!.color} bg-opacity-20 ${textColorClass}`}>{mood!.label}</span>
                })}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default memo(WorkCardComponent)
