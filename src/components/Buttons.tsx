import type { MoodType } from "../types/MoodType";
import { motion, AnimatePresence } from "framer-motion";
import { useMoodStore } from "../stores/moodStore.ts";
import { useState} from "react";

interface ButtonsProps{

  moods:MoodType[]
  activeMoods: number[] // On reçoit les ID actifs

}

function Buttons({moods, activeMoods} : ButtonsProps){
  const { toggleTodayMood, resetTodayMoods } = useMoodStore();

    // État temporaire pour le feedback visuel immédiat
  const [clickedMoodId, setClickedMoodId] = useState<number | null>(null);

              // Gestionnaire avec feedback immédiat
  const handleMoodClick = (moodId: number) => {
    // Feedback visuel immédiat : simuler l'état actif
    setClickedMoodId(moodId);

    // Appel au store (en arrière-plan) - SANS .then() !
    toggleTodayMood(moodId).catch(error => {
      console.error('Store error:', error);
      setClickedMoodId(null); // Reset en cas d'erreur
    });

    // Cleanup automatique après un délai court
    setTimeout(() => {
      setClickedMoodId(null);
    }, 100); // 100ms de feedback visuel
  };

  // Gestionnaire pour le reset
  const handleReset = async () => {
    // Appel au store
    await resetTodayMoods();
  };
  return(
    // On ajoute flex-wrap pour que les boutons passent à la ligne sur les petits écrans
    <div className="flex justify-center items-center flex-wrap gap-4 my-8 mx-4">
                     {moods.map((mood) => {
          const isActive = activeMoods.includes(mood.id);
          const isClicked = clickedMoodId === mood.id;

          // Si le mood est cliqué, on force l'état actif pour le feedback visuel
          const shouldShowActive = isActive || isClicked;

         return (
           <button
           key={mood.id}
           aria-pressed={shouldShowActive}
           className={`
             ${mood.color}
             px-6 py-3 rounded-lg font-semibold text-gray-800 shadow-md
             transform hover:scale-110
             focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-white
             transition-all duration-200
             ${shouldShowActive ? 'scale-110 ring-2 ring-white' : 'scale-100'}
           `}
           onClick={() => handleMoodClick(mood.id)}
         >{mood.label} {mood.emoji}</button>
         )
       })}

      {/* Le bouton Reset n'apparaît que si au moins une humeur est active */}
      <AnimatePresence>
        {activeMoods.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleReset}
            className="px-4 py-2 border-2 border-slate-500 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-400 transition-colors duration-200"
          >
            Reset
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Buttons
