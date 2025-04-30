import React, { memo } from 'react';
import { Requirement, CheckedState } from '../types';
import './Roadmap.css';

interface RoadmapProps {
  requirements: Requirement[];
  checked: CheckedState;
  onToggle: (label: string, course: string) => void;
}

const RequirementStep: React.FC<{
  requirement: Requirement;
  checked: CheckedState;
  onToggle: (label: string, course: string) => void;
  isEven: boolean;
}> = memo(({ requirement, checked, onToggle, isEven }) => (
  <div className={`roadmap-step ${isEven ? 'right' : 'left'}`}>
    <div className="roadmap-circle" />
    <div className="roadmap-content">
      <h3 className="roadmap-title">{requirement.label}</h3>
      {requirement.courses && (
        <div className="roadmap-courses">
          {requirement.courses.map((course) => (
            <label key={course} className="roadmap-checkbox">
              <input
                type="checkbox"
                checked={!!checked[`${requirement.label}::${course}`]}
                onChange={() => onToggle(requirement.label, course)}
                aria-label={`${course} - ${requirement.label}`}
              />
              <span>{course}</span>
            </label>
          ))}
        </div>
      )}
      {requirement.type === 'credits' && (
        <div className="roadmap-courses">
          <div className="roadmap-checkbox">
            {requirement.label}: {requirement.credits} credits in {requirement.subject}
            {requirement.level ? ` at the ${requirement.level} level or above` : ''}
          </div>
        </div>
      )}
    </div>
  </div>
));

const Roadmap: React.FC<RoadmapProps> = memo(({ requirements, checked, onToggle }) => (
  <div className="elegant-roadmap" role="list">
    <div className="roadmap-line" />
    {requirements.map((req, idx) => (
      <RequirementStep
        key={`${req.label}-${idx}`}
        requirement={req}
        checked={checked}
        onToggle={onToggle}
        isEven={idx % 2 === 0}
      />
    ))}
  </div>
));

export default Roadmap;