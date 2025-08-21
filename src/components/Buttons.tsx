import type { MoodType } from "../types/MoodType";
import { motion, AnimatePresence } from "framer-motion";
import { useMoodStore } from "../stores/moodStore.ts";

interface ButtonsProps{

  moods:MoodType[]
  activeMoods: number[] // On reçoit les ID actifs

}

function Buttons({moods, activeMoods} : ButtonsProps){
  const { toggleTodayMood, resetTodayMoods } = useMoodStore();
  return(
    // On ajoute flex-wrap pour que les boutons passent à la ligne sur les petits écrans
    <div className="flex justify-center items-center flex-wrap gap-4 my-8 mx-4">
      {moods.map((mood) => {
        const isActive = activeMoods.includes(mood.id);
        return (
          <button
          key={mood.id}
          aria-pressed={isActive}
          className={`
            ${mood.color}
            px-6 py-3 rounded-lg font-semibold text-gray-800 shadow-md
            transform hover:scale-110
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-white
            transition-all duration-200
            ${isActive ? 'scale-110 ring-2 ring-white' : 'scale-100'}
          `}
          onClick={()=>toggleTodayMood(mood.id)}
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
            onClick={resetTodayMoods}
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
