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

  const renderCourses = () => {
    if (requirement.type === 'note') {
      return (
        <div className="roadmap-courses">
          <div className="roadmap-notes">{requirement.notes}</div>
        </div>
      );
    }

    if (requirement.type === 'credits' && requirement.credits) {
      return (
        <div className="roadmap-courses">
          {requirement.notes && (
            <div className="roadmap-notes">{requirement.notes}</div>
          )}
          <CreditScale
            label={`${requirement.level ? `level ${requirement.level}` : ''}`}
            maxCredits={requirement.credits}
            currentCredits={creditProgress[requirement.label] || 0}
            onCreditsChange={(credits) => onCreditsChange(requirement.label, credits)}
          />
        </div>
      );
    }

    if (!requirement.courses?.length) return null;

    // Define which courses are alternatives
    let alternativePairs = [
      ['ARTH 130 - African American Art', 'ARTH 131 - Art of the African Diaspora'],
      ['ARTH 140 - Asian Art', 'ARTH 141 - Buddhist Art of South and Central Asia'],
      ['CHEM 110 - General Chemistry and Lab', 'CHEM 109 - General Chemistry & CHEM 115 - General Chemistry Laboratory'],
      ['CHEM 241 - Organic Chemistry I and Lab', 'CHEM 240 - Organic Chemistry I & CHEM 245 - Organic Chemistry I Laboratory'],
      ['CHEM 242 - Organic Chemistry II and Lab', 'CHEM 244 - Organic Chemistry II & CHEM 246 - Organic Chemistry II Laboratory'],
      ['BIOL 211S - Cell Biology at St. Andrews', 'BIOL 230 - Cell Biology'],
      ['NEUR 395 - Special Topics in Cellular and Molecular Neuroscience', 'NEUR 423 - Directed Individual Research'],
      ['BIOL 340 - Evolution', 'BIOL 340S - Evolutionary Biology at St. Andrews'],
      ['BIOL 211S - Cell Biology at St. Andrews', 'BIOL 230 - Cell Biology'],
      ['BIOL 215 - Biochemistry of the Cell *', 'BIOL 215S - Biochemistry at St. Andrews *'],
      ['BIOL 240 - Comparative Animal Biology *', 'BIOL 240S - Zoology at St. Andrews *'],
      ['BIOL 245 - Ecology *', 'BIOL 245S - Ecology at St Andrews'],
      ['BIOL 260 - Anatomy and Physiology *', 'BIOL 261S - Comparative Physiology at St. Andrews *'],
      ['BIOL 215 - Biochemistry of the Cell', 'BIOL 215S - Biochemistry at St. Andrews'],
      ['BIOL 240 - Comparative Animal Biology', 'BIOL 240S - Zoology at St. Andrews'],
      ['BIOL 245 - Ecology', 'BIOL 245S - Ecology at St Andrews'],
      ['BIOL 260 - Anatomy and Physiology', 'BIOL 261S - Comparative Physiology at St. Andrews'],
      ['CHEM 260 - Physical Chemistry of Biological Systems', 'CHEM 261 - Physical Chemistry: Quantum & Computational Chemistry'],
      ['CSCI 111 - Introduction to Computer Science', 'CSCI 121 - Scientific Computing'],
      ['MUS 473 - Senior Thesis', 'MUS 493 - Honors Thesis'],
      ['BIOL 220 - Genetics', 'BIOL 230 - Cell Biology or BIOL 211S - Cell Biology at St. Andrews'],
      ['BIOL 201 - Statistics for Biology and Medicine', 'CBSC 250 - Statistics and Research Design']
    ];

    const courses = requirement.courses || [];
    const altPairs: [string, string][] = [];
    for (let i = 0; i < courses.length - 1; i++) {
      if (alternativePairs.some(pair => pair[0] === courses[i] && pair[1] === courses[i + 1])) {
        altPairs.push([courses[i], courses[i + 1]]);
      }
    }

    const renderCourse = (course: string) => {
      const pair = altPairs.find(pair => pair.includes(course));
      const isPair = !!pair;
      const isOtherChecked = isPair && checked[`${requirement.label}::${pair!.find(c => c !== course)}`];
      let isDisabled = false;
      if (requirement.type === 'n_of') {
        if (isComplete && !checked[`${requirement.label}::${course}`]) {
          isDisabled = true;
        } else if (!isComplete && isPair && isOtherChecked) {
          isDisabled = true;
        }
      } else if (isPair && isOtherChecked) {
        isDisabled = true;
      }
      const dashedClass = isDisabled ? 'dashed-disabled' : '';
      const isFirstInPair = pair && pair[0] === course;

      return (
        <React.Fragment key={course}>
          <label className={`roadmap-checkbox ${dashedClass}`}>
            <input
              type="checkbox"
              checked={!!checked[`${requirement.label}::${course}`]}
              onChange={() => onToggle(requirement.label, course)}
              aria-label={`${course} - ${requirement.label}`}
              disabled={isDisabled}
            />
            <span>{course}</span>
          </label>
          {isFirstInPair && <div className="or-text">or</div>}
        </React.Fragment>
      );
    };

    return (
      <div className="roadmap-courses">
        {courses.map(renderCourse)}
      </div>
    );
  };
  
  return (
    <div className={`roadmap-step ${isEven ? 'right' : 'left'}`}>
      <div className="roadmap-circle" />
      <div className="roadmap-content">
        <h3 className="roadmap-title">{requirement.label}</h3>
        {renderCourses()}
      </div>
    </div>
  );
});

const Roadmap: React.FC<RoadmapProps> = memo(({ requirements, checked, creditProgress, onToggle, onCreditsChange }) => {
  // Custom rendering for Biochemistry (BS)

  // Default rendering for all other majors
  return (
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
  );
});

export default Roadmap;