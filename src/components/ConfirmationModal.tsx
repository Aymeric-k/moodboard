import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../stores/uiStore';
import { useWorkStore } from '../stores/workStore';

export default function ConfirmationModal() {
  const { workToDeleteId, closeDeleteModal } = useUIStore();
  const { getWorkById, deleteWork: deleteWorkFromStore } = useWorkStore();

  const work = useMemo(() => (
    workToDeleteId ? getWorkById(workToDeleteId) : null
  ), [workToDeleteId, getWorkById]);

  const handleConfirm = () => {
    if (workToDeleteId) {
      deleteWorkFromStore(workToDeleteId);
      closeDeleteModal();
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
      onClick={closeDeleteModal} // Permet de fermer en cliquant sur le fond
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="bg-slate-800 rounded-lg p-8 shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant dans le modal
      >
        <h2 id="dialog-title" className="text-2xl font-bold text-white mb-4">Confirm Deletion</h2>
        <p id="dialog-description" className="text-slate-300 mb-6">
          Are you sure you want to permanently delete <strong className="text-yellow-400">{work.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button onClick={closeDeleteModal} className="px-6 py-2 rounded-md text-white bg-slate-600 hover:bg-slate-500 transition-colors">Cancel</button>
          <button onClick={handleConfirm} className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-500 transition-colors">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
