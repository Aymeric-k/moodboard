import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../stores/uiStore';
import { useWorkStore } from '../stores/workStore';

export default function NotesModal() {
  const { notesModalWorkId, closeNotesModal } = useUIStore();
  const { getWorkById, updateWork } = useWorkStore();
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const work = notesModalWorkId ? getWorkById(notesModalWorkId) : null;

  // Initialize notes when modal opens
  useEffect(() => {
    if (work) {
      setNotes(work.notes || '');
      setIsEditing(false);
      setHasChanges(false);
    }
  }, [work]);

  // Track changes
  useEffect(() => {
    if (work) {
      setHasChanges(notes !== (work.notes || ''));
    }
  }, [notes, work]);

  const handleSave = () => {
    if (work && hasChanges) {
      updateWork({ ...work, notes });
      setHasChanges(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (work) {
      setNotes(work.notes || '');
      setHasChanges(false);
      setIsEditing(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      // Ask for confirmation if there are unsaved changes
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        closeNotesModal();
      }
    } else {
      closeNotesModal();
    }
  };

  if (!work) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-modal-title"
        className="bg-slate-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 id="notes-modal-title" className="text-2xl font-bold text-white">
              Notes for {work.title}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {work.category.replace('-', ' ')} • {work.status}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {isEditing ? (
            <div className="h-full flex flex-col">
              <label htmlFor="notes-editor" className="text-sm font-medium text-slate-300 mb-2">
                Edit Notes
              </label>
              <textarea
                id="notes-editor"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here..."
                className="flex-1 w-full bg-slate-700 text-white rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-400"
                autoFocus
              />
            </div>
          ) : (
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Notes</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>

              {notes ? (
                <div className="bg-slate-700 rounded-lg p-4 h-full overflow-y-auto">
                  <pre className="text-white whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {notes}
                  </pre>
                </div>
              ) : (
                <div className="bg-slate-700 rounded-lg p-8 h-full flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No notes yet</p>
                    <p className="text-sm">Click "Edit" to add your first note</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="flex justify-end gap-4 p-6 border-t border-slate-700">
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-md text-white bg-slate-600 hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-md text-white transition-colors ${
                hasChanges
                  ? 'bg-green-600 hover:bg-green-500 cursor-pointer'
                  : 'bg-slate-500 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
