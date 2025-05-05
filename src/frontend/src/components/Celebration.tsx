import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './Celebration.css';

interface CelebrationProps {
  isComplete: boolean;
}

const Celebration: React.FC<CelebrationProps> = ({ isComplete }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
    }
  }, [isComplete]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => {
    setShowConfetti(false);
  };

  if (!showConfetti) return null;

  return (
    <div className="celebration-container">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />
      <div className="celebration-message">
        <button className="close-button" onClick={handleClose} aria-label="Close celebration">
          ×
        </button>
        <h2>Congratulations! 🎉</h2>
        <p>You've completed all requirements!</p>
        <p style={{ fontWeight: 600, color: '#ffd700', marginTop: '0.5rem' }}>You're almost done! Check the catalog for additional credit or graduation requirements.</p>
      </div>
    </div>
  );
};

export default Celebration; 