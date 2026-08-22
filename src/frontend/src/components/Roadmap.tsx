import React, { memo } from 'react';
import { Requirement, CheckedState, CreditProgress } from '../types';
import './Roadmap.css';
import CreditScale from './CreditScale';
import { alternativePairs, trackFor } from '../data/tracks';
import { groupLabel, unitOf } from '../data/progress';

interface RoadmapProps {
  requirements: Requirement[];
  checked: CheckedState;
  creditProgress: CreditProgress;
  onToggle: (label: string, course: string) => void;
  onCreditsChange: (label: string, credits: number) => void;
  majorName?: string;
  ignoredEmphases?: { [track: string]: boolean };
  handleToggleEmphasis?: (track: string) => void;
}

const RequirementStep: React.FC<{
  requirement: Requirement;
  checked: CheckedState;
  creditProgress: CreditProgress;
  onToggle: (label: string, course: string) => void;
  onCreditsChange: (label: string, credits: number) => void;
  isEven: boolean;
  className?: string;
  majorName?: string;
  showTrackToggle?: boolean;
  ignoredEmphases?: { [track: string]: boolean };
  handleToggleEmphasis?: (track: string) => void;
}> = memo(({ requirement, checked, creditProgress, onToggle, onCreditsChange, isEven, className, majorName, showTrackToggle, ignoredEmphases, handleToggleEmphasis }) => {
  
  // Calculate how many courses are checked for n_of and one_of type requirements
  const selectedCount = (requirement.type === 'n_of' || requirement.type === 'one_of') && requirement.courses
    ? requirement.courses.filter(course => checked[`${requirement.label}::${course}`]).length
    : 0;
  
  const isComplete = (requirement.type === 'n_of' && selectedCount >= (requirement.n || 0)) ||
                    (requirement.type === 'one_of' && selectedCount >= 1);

  // Requirements that belong to a mutually exclusive track can be switched off
  const track = trackFor(majorName, requirement.label);
  const isIgnored = !!(track && ignoredEmphases?.[track]);

  const renderCourses = () => {
    if (requirement.type === 'note') {
      return (
        <div className="roadmap-courses">
          <div className="roadmap-notes" dangerouslySetInnerHTML={{ __html: requirement.notes || '' }} />
        </div>
      );
    }

    if (requirement.type === 'credits' && requirement.credits) {
      return (
        <div className="roadmap-courses">
          {requirement.notes && (
            <div className="roadmap-notes" dangerouslySetInnerHTML={{ __html: requirement.notes }} />
          )}
          <CreditScale
            label={`${requirement.level ? `level ${requirement.level} ` : ''}${unitOf(requirement)}`}
            maxCredits={requirement.credits}
            currentCredits={creditProgress[requirement.label] || 0}
            onCreditsChange={isIgnored ? () => {} : (credits) => onCreditsChange(requirement.label, credits)}
            key={isIgnored ? 'disabled' : 'enabled'}
          />
        </div>
      );
    }

    if (requirement.type === 'group' && requirement.groups?.length) {
      const groups = requirement.groups;
      const required = requirement.groupsRequired ?? groups.length;
      return (
        <div className="roadmap-courses">
          {requirement.notes && (
            <div className="roadmap-notes" dangerouslySetInnerHTML={{ __html: requirement.notes }} />
          )}
          {required < groups.length && (
            <div className="roadmap-notes">
              Satisfy any {required} of the {groups.length} areas below.
            </div>
          )}
          {groups.map(g => {
            const gl = groupLabel(requirement.label, g.label);
            const need = g.n ?? 1;
            const hit = g.courses.filter(c => checked[`${gl}::${c}`]).length;
            const full = hit >= need;
            return (
              <div className="roadmap-group" key={g.label}>
                <div className="roadmap-group-title">
                  <span dangerouslySetInnerHTML={{ __html: g.label }} />
                  <span className="roadmap-group-count">{hit}/{need}</span>
                </div>
                {g.courses.map(c => {
                  const on = !!checked[`${gl}::${c}`];
                  const off = full && !on;
                  return (
                    <label
                      key={c}
                      className={`roadmap-checkbox ${off ? 'dashed-disabled' : ''}`.trim()}
                      style={isIgnored ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => onToggle(gl, c)}
                        aria-label={`${c} - ${g.label}`}
                        disabled={isIgnored || off}
                      />
                      <span dangerouslySetInnerHTML={{ __html: c }} />
                    </label>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    if (!requirement.courses?.length) return null;

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
          <label className={`roadmap-checkbox ${dashedClass}`} style={isIgnored ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
            <input
              type="checkbox"
              checked={!!checked[`${requirement.label}::${course}`]}
              onChange={() => onToggle(requirement.label, course)}
              aria-label={`${course} - ${requirement.label}`}
              disabled={isDisabled || isIgnored}
            />
            <span dangerouslySetInnerHTML={{ __html: course }} />
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
    <div className={`roadmap-step ${isEven ? 'right' : 'left'} ${className || ''}`.trim()}>
      <div className="roadmap-circle" />
      <div className="roadmap-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 className="roadmap-title" dangerouslySetInnerHTML={{ __html: requirement.label }} />
          {(track && showTrackToggle && handleToggleEmphasis) && (
            <button
              style={{ 
                background: isIgnored ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)', 
                color: '#fff', 
                border: isIgnored ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 0, 0, 0.3)', 
                borderRadius: '0.5rem', 
                padding: '0.3rem 0.6rem', 
                cursor: 'pointer', 
                fontWeight: 600, 
                fontSize: '0.8rem' 
              }}
              onClick={() => handleToggleEmphasis(track)}
              type="button"
            >
              {isIgnored ? 'CONSIDER' : 'NOT CONSIDERING'}
            </button>
          )}
        </div>
        {renderCourses()}
      </div>
    </div>
  );
});

const Roadmap: React.FC<RoadmapProps> = memo(({ requirements, checked, creditProgress, onToggle, onCreditsChange, majorName, ignoredEmphases, handleToggleEmphasis }) => {
  // Detect if this is Computer Science (BA)
  const isCSBA = majorName === 'Computer Science (BA)';
  // one toggle per track, rendered on that track's first requirement
  const seenTracks = new Set<string>();
  const trackToggleAt = requirements.map(req => {
    const t = trackFor(majorName, req.label);
    if (!t || seenTracks.has(t)) return false;
    seenTracks.add(t);
    return true;
  });

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
          className={isCSBA ? 'csba-step' : ''}
          majorName={majorName}
          showTrackToggle={trackToggleAt[idx]}
          ignoredEmphases={ignoredEmphases}
          handleToggleEmphasis={handleToggleEmphasis}
        />
      ))}
    </div>
  );
});

export default Roadmap;