import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Major, AllProgress, MajorProgress } from './types';
import Roadmap from './components/Roadmap';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import './App.css';
import CircularProgress from './components/CircularProgress';
import { fetchMajors } from './services/api';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Celebration from './components/Celebration';

const STORAGE_KEY = 'wlu-major-tracker-progress';

function App() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProgress, setAllProgress] = useState<AllProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Failed to load saved progress:', error);
      return {};
    }
  });

  const loadMajors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMajors();
      setMajors(data);
      if (data.length > 0) {
        setSelectedMajor(data[0]);
      }
    } catch (err) {
      setError('Failed to load majors. Please try again later.');
      console.error('Error loading majors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMajors();
  }, [loadMajors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [allProgress]);

  const getCurrentProgress = useCallback((major: Major | null): MajorProgress => {
    if (!major) return { checked: {}, creditProgress: {} };
    return allProgress[major.major] || { checked: {}, creditProgress: {} };
  }, [allProgress]);

  const handleToggle = useCallback((label: string, course: string) => {
    if (!selectedMajor) return;
    
    const currentProgress = getCurrentProgress(selectedMajor);
    const key = `${label}::${course}`;
    
    setAllProgress(prev => ({
      ...prev,
      [selectedMajor.major]: {
        ...currentProgress,
        checked: {
          ...currentProgress.checked,
          [key]: !currentProgress.checked[key]
        }
      }
    }));
  }, [selectedMajor, getCurrentProgress]);

  const handleCreditsChange = useCallback((label: string, credits: number) => {
    if (!selectedMajor) return;
    
    const currentProgress = getCurrentProgress(selectedMajor);
    
    setAllProgress(prev => ({
      ...prev,
      [selectedMajor.major]: {
        ...currentProgress,
        creditProgress: {
          ...currentProgress.creditProgress,
          [label]: credits
        }
      }
    }));
  }, [selectedMajor, getCurrentProgress]);

  const handleResetProgress = useCallback(() => {
    if (selectedMajor) {
      setAllProgress(prev => ({
        ...prev,
        [selectedMajor.major]: {
          checked: {},
          creditProgress: {}
        }
      }));
    }
  }, [selectedMajor]);

  const getProgress = useCallback(() => {
    if (!selectedMajor) return 0;
    
    const currentProgress = getCurrentProgress(selectedMajor);
    const { checked, creditProgress } = currentProgress;
    
    const { total, completed } = selectedMajor.requirements.reduce(
      (acc, req) => {
        if (req.type === 'credits' && req.credits) {
          acc.total += 1;
          const currentCredits = creditProgress[req.label] || 0;
          if (currentCredits >= req.credits) {
            acc.completed += 1;
          }
        } else if (req.courses) {
          if (req.type === 'all') {
            acc.total += req.courses.length;
            acc.completed += req.courses.filter(
              course => checked[`${req.label}::${course}`]
            ).length;
          } else if (req.type === 'one_of' || req.type === 'n_of') {
            acc.total += 1;
            const selectedCount = req.courses.filter(
              course => checked[`${req.label}::${course}`]
            ).length;
            if ((req.type === 'one_of' && selectedCount >= 1) ||
                (req.type === 'n_of' && selectedCount >= (req.n || 0))) {
              acc.completed += 1;
            }
          }
        }
        return acc;
      },
      { total: 0, completed: 0 }
    );

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [selectedMajor, getCurrentProgress]);

  const progress = useMemo(() => getProgress(), [getProgress]);

  const handleHomeClick = useCallback(() => {
    setSelectedMajor(null);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={loadMajors} />;
    }

    if (!selectedMajor) {
      return (
        <section className="major-selection">
          <h2>Select a Major</h2>
          {majors.length === 0 ? (
            <p className="no-majors">No majors available at the moment.</p>
          ) : (
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
          )}
        </section>
      );
    }

    const currentProgress = getCurrentProgress(selectedMajor);

    return (
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
          <button 
            className="reset-button"
            onClick={handleResetProgress}
          >
            Reset Progress
          </button>
        </div>
        <h2>{selectedMajor.major} Roadmap</h2>
        <Roadmap
          requirements={selectedMajor.requirements}
          checked={currentProgress.checked}
          creditProgress={currentProgress.creditProgress}
          onToggle={handleToggle}
          onCreditsChange={handleCreditsChange}
        />
      </section>
    );
  };

  return (
    <div className="app-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
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
        className="particles"
      />
      <div className="app-content">
        <header>
          <button 
            className="home-button"
            onClick={handleHomeClick}
            aria-label="Go to home"
          >
            HOME PAGE
          </button>
          <h1>W&L Major Tracker</h1>
          <p>{selectedMajor ? `For ${selectedMajor.major}` : "Don't get lost buddy!"}</p>
        </header>
        <main>
          {renderContent()}
        </main>
      </div>
      <Celebration isComplete={progress === 100} />
    </div>
  );
}

export default App;