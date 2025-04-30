import React, { memo } from 'react';
import { Requirement, CheckedState, CreditProgress } from '../types';
import './Roadmap.css';
import CreditScale from './CreditScale';

interface RoadmapProps {
  requirements: Requirement[];
  checked: CheckedState;
  creditProgress: CreditProgress;
  onToggle: (label: string, course: string) => void;
  onCreditsChange: (label: string, credits: number) => void;
}

const RequirementStep: React.FC<{
  requirement: Requirement;
  checked: CheckedState;
  creditProgress: CreditProgress;
  onToggle: (label: string, course: string) => void;
  onCreditsChange: (label: string, credits: number) => void;
  isEven: boolean;
}> = memo(({ requirement, checked, creditProgress, onToggle, onCreditsChange, isEven }) => {
  console.log('Rendering requirement:', requirement.label);
  console.log('Is credits type:', requirement.type === 'credits');
  console.log('Has credits:', requirement.credits);
  
  // Calculate how many courses are checked for n_of and one_of type requirements
  const selectedCount = (requirement.type === 'n_of' || requirement.type === 'one_of') && requirement.courses
    ? requirement.courses.filter(course => checked[`${requirement.label}::${course}`]).length
    : 0;
  
  const isComplete = (requirement.type === 'n_of' && selectedCount >= (requirement.n || 0)) ||
                    (requirement.type === 'one_of' && selectedCount >= 1);
  
  return (
    <div className={`roadmap-step ${isEven ? 'right' : 'left'}`}>
      <div className="roadmap-circle" />
      <div className="roadmap-content">
        <h3 className="roadmap-title">{requirement.label}</h3>
        {requirement.type === 'credits' && requirement.credits ? (
          <div className="roadmap-courses">
            <CreditScale
              label={`${requirement.subject} ${requirement.level ? `level ${requirement.level}` : ''}`}
              maxCredits={requirement.credits}
              currentCredits={creditProgress[requirement.label] || 0}
              onCreditsChange={(credits) => onCreditsChange(requirement.label, credits)}
            />
          </div>
        ) : requirement.courses ? (
          <div className="roadmap-courses">
            {requirement.courses.map((course) => {
              const isChecked = !!checked[`${requirement.label}::${course}`];
              const isDisabled = (requirement.type === 'n_of' || requirement.type === 'one_of') && 
                               isComplete && !isChecked;
              
              return (
                <label 
                  key={course} 
                  className={`roadmap-checkbox ${isDisabled ? 'disabled' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(requirement.label, course)}
                    aria-label={`${course} - ${requirement.label}`}
                    disabled={isDisabled}
                  />
                  <span>{course}</span>
                </label>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
});

const Roadmap: React.FC<RoadmapProps> = memo(({ requirements, checked, creditProgress, onToggle, onCreditsChange }) => (
  <div className="elegant-roadmap" role="list">
    <div className="roadmap-line" />
    {requirements.map((req, idx) => (
      <RequirementStep
        key={`${req.label}-${idx}`}
        requirement={req}
        checked={checked}
        creditProgress={creditProgress}
        onToggle={onToggle}
        onCreditsChange={onCreditsChange}
        isEven={idx % 2 === 0}
      />
    ))}
  </div>
));

export default Roadmap;