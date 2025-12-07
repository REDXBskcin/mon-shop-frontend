import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ show, message, type = 'success', onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-8 right-8 z-50 max-w-md"
        >
          <div className={`${
            type === 'success' 
              ? 'bg-green-500 border-green-400' 
              : type === 'error'
              ? 'bg-red-500 border-red-400'
              : 'bg-indigo-500 border-indigo-400'
          } text-white px-6 py-4 rounded-xl shadow-2xl border-2 backdrop-blur-md flex items-center gap-3 font-medium`}>
            <div className={`${
              type === 'success' 
                ? 'bg-green-600' 
                : type === 'error'
                ? 'bg-red-600'
                : 'bg-indigo-600'
            } rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0`}>
              {type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : type === 'error' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="flex-1">{message}</p>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
