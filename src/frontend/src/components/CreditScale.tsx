import React from 'react';
import './CreditScale.css';

interface CreditScaleProps {
  label: string;
  maxCredits: number;
  currentCredits: number;
  onCreditsChange: (credits: number) => void;
}

const CreditScale: React.FC<CreditScaleProps> = ({
  label,
  maxCredits,
  currentCredits,
  onCreditsChange,
}) => {
  console.log('Rendering CreditScale:', { label, maxCredits, currentCredits });
  
  return (
    <div className="credit-scale-container">
      <div className="credit-scale-label">{label}</div>
      <div className="credit-scale">
        {Array.from({ length: maxCredits + 1 }, (_, i) => (
          <button
            key={i}
            className={`credit-scale-button ${i === currentCredits ? 'selected' : ''}`}
            onClick={() => onCreditsChange(i)}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreditScale; 