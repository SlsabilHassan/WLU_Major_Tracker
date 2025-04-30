import React, { useEffect, useState, useCallback, useMemo } from 'react';
import majorsData from './data/majors.json';
import { Major, CheckedState } from './types';
import Roadmap from './components/Roadmap';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import './App.css';
import './components/Roadmap.css';
import CircularProgress from './components/CircularProgress';

const STORAGE_KEY = 'wlu-major-tracker-checked';

function App() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [checked, setChecked] = useState<CheckedState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Failed to load saved progress:', error);
      return {};
    }
  });

  useEffect(() => {
    setMajors(majorsData as Major[]);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch (error) {
      console.error('Failed to save progress:', error);
      // Optionally show a user-friendly error message here
    }
  }, [checked]);

  const getProgress = useCallback(() => {
    if (!selectedMajor) return 0;
    
    const { total, completed } = selectedMajor.requirements.reduce(
      (acc, req) => {
        if (req.courses) {
          if (req.type === 'all') {
            acc.total += req.courses.length;
            acc.completed += req.courses.filter(
              course => checked[`${req.label}::${course}`]
            ).length;
          } else if (req.type === 'one_of') {
            acc.total += 1;
            if (req.courses.some(course => checked[`${req.label}::${course}`])) {
              acc.completed += 1;
            }
          } else if (req.type === 'n_of' && req.n) {
            acc.total += req.n;
            const checkedCount = req.courses.filter(
              course => checked[`${req.label}::${course}`]
            ).length;
            acc.completed += Math.min(checkedCount, req.n);
          }
        } else if (req.type === 'credits') {
          acc.total += 1;
          // TODO: Implement credit tracking if needed
        }
        return acc;
      },
      { total: 0, completed: 0 }
    );

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [selectedMajor, checked]);

  const progress = useMemo(() => getProgress(), [getProgress]);

  const handleToggle = useCallback((label: string, course: string) => {
    const key = `${label}::${course}`;
    setChecked(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const particlesInit = useCallback(async (main: any) => {
    await loadFull(main);
  }, []);

  return (
    <div className="app-container">
      <Particles
        id="tsparticles"
        options={{
          background: { color: "#000000" },
          particles: {
            color: { value: "#fff" },
            number: { value: 80 },
            size: { value: 2 },
            move: { enable: true, speed: 0.2 },
            opacity: { value: 0.7 }
          }
        }}
        init={particlesInit}
        className="particles"
      />
      <div className="app-content">
        <header>
          <h1>W&L Major Tracker</h1>
          <p>Don't get lost buddy!</p>
        </header>
        <main>
          {!selectedMajor ? (
            <section className="major-selection">
              <h2>Select a Major</h2>
              <div className="major-list">
                {majors.map((major) => (
                  <button
                    key={major.major}
                    className="major-button"
                    onClick={() => setSelectedMajor(major)}
                  >
                    {major.major}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="major-details">
              <button
                className="back-button"
                onClick={() => setSelectedMajor(null)}
                aria-label="Back to majors list"
              >
                ← Back to Majors
              </button>
              <div className="circular-progress-container">
                <CircularProgress progress={progress} size={200} strokeWidth={10} progressColor='#fff' />
              </div>
              <h2>{selectedMajor.major} Roadmap</h2>
              <Roadmap
                requirements={selectedMajor.requirements}
                checked={checked}
                onToggle={handleToggle}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;