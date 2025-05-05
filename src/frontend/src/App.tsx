import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Major, AllProgress, MajorProgress } from './types';
import Roadmap from './components/Roadmap';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import './App.css';
import './styles.css';
import CircularProgress from './components/CircularProgress';
import { fetchMajors } from './services/api';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Celebration from './components/Celebration';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

const STORAGE_KEY = 'wlu-major-tracker-progress';

function MajorPage({ majors, allProgress, setAllProgress, getCurrentProgress, handleToggle, handleCreditsChange, handleResetProgress, getProgress }: any) {
  const { majorName } = useParams();
  const navigate = useNavigate();
  const major = majors.find((m: Major) => m.major === decodeURIComponent(majorName || ''));
  const progress = useMemo(() => getProgress(major), [getProgress, major]);
  const currentProgress = getCurrentProgress(major);

  if (!major) {
    return <ErrorMessage message="Major not found." onRetry={() => navigate('/')} />;
  }

  return (
    <section className="major-details">
      <button
        className="back-button"
        onClick={() => navigate('/')}
        aria-label="Back to majors list"
      >
        ← Back to Majors
      </button>
      <div className="circular-progress-container">
        <CircularProgress progress={progress} size={200} strokeWidth={10} progressColor='#fff' />
        <button 
          className="reset-button"
          onClick={() => handleResetProgress(major)}
        >
          Reset Progress
        </button>
      </div>
      <h2>{major.major} Roadmap</h2>
      <Roadmap
        requirements={major.requirements}
        checked={currentProgress.checked}
        creditProgress={currentProgress.creditProgress}
        onToggle={(label, course) => handleToggle(major, label, course)}
        onCreditsChange={(label, credits) => handleCreditsChange(major, label, credits)}
      />
      {progress === 100 && <Celebration isComplete={true} />}
    </section>
  );
}

function HomePage({ majors, searchQuery, setSearchQuery, handleClearSearch }: any) {
  const filteredMajors = majors.filter((major: Major) => 
    major.major.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <section className="major-selection">
      <h2>Select a Major</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search majors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="clear-search-button"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {filteredMajors.length === 0 ? (
        <p className="no-majors">No majors match your search.</p>
      ) : (
        <div className="major-list">
          {filteredMajors.map((major: Major) => (
            <Link
              key={major.major}
              to={`/major/${encodeURIComponent(major.major)}`}
              className="major-button"
              style={{ textDecoration: 'none' }}
            >
              {major.major}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleToggle = useCallback((major: Major, label: string, course: string) => {
    const currentProgress = getCurrentProgress(major);
    const key = `${label}::${course}`;
    setAllProgress(prev => ({
      ...prev,
      [major.major]: {
        ...currentProgress,
        checked: {
          ...currentProgress.checked,
          [key]: !currentProgress.checked[key]
        }
      }
    }));
  }, [getCurrentProgress]);

  const handleCreditsChange = useCallback((major: Major, label: string, credits: number) => {
    const currentProgress = getCurrentProgress(major);
    setAllProgress(prev => ({
      ...prev,
      [major.major]: {
        ...currentProgress,
        creditProgress: {
          ...currentProgress.creditProgress,
          [label]: credits
        }
      }
    }));
  }, [getCurrentProgress]);

  const handleResetProgress = useCallback((major: Major) => {
    setAllProgress(prev => ({
      ...prev,
      [major.major]: {
        checked: {},
        creditProgress: {}
      }
    }));
  }, []);

  const getProgress = useCallback((major: Major | null) => {
    if (!major) return 0;
    const currentProgress = getCurrentProgress(major);
    const { checked, creditProgress } = currentProgress;
    const { total, completed } = major.requirements.reduce(
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
  }, [getCurrentProgress]);

  const handleHomeClick = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Router>
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
              opacity: { value: 0.5 }
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
            <img src="/logo.png" alt="W&L Major Tracker Logo" className="main-logo" />
            <p>{"Don't get lost buddy!"}</p>
          </header>
          <main>
            <Routes>
              <Route path="/" element={
                <HomePage
                  majors={majors}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleClearSearch={handleClearSearch}
                />
              } />
              <Route path="/major/:majorName" element={
                <MajorPage
                  majors={majors}
                  allProgress={allProgress}
                  setAllProgress={setAllProgress}
                  getCurrentProgress={getCurrentProgress}
                  handleToggle={handleToggle}
                  handleCreditsChange={handleCreditsChange}
                  handleResetProgress={handleResetProgress}
                  getProgress={getProgress}
                />
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;