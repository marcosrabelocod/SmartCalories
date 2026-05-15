import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X } from 'lucide-react';
import { useConquistas } from '../../../IaFunctions/ConquistasContext';
import './Conquistas.css';

const ConquistaGlobalPopup: React.FC = () => {
  const { showPopup, closePopup } = useConquistas();

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(closePopup, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, closePopup]);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="conquista-popup-overlay"
        >
          <div className="conquista-popup-content">
            <button className="close-popup-btn" onClick={closePopup}>
              <X size={16} />
            </button>
            <div className="conquista-icon-wrapper pulse-animation">
              <Trophy size={32} className="text-yellow-500" />
            </div>
            <h3 className="conquista-popup-title">Nova Conquista!</h3>
            <div className="conquista-popup-name">{showPopup.title}</div>
            <p className="conquista-popup-desc">{showPopup.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConquistaGlobalPopup;
