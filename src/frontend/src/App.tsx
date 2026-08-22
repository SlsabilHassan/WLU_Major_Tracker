import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Major, AllProgress, MajorProgress } from './types';
import { majorTracks, countAlternativePairs } from './data/tracks';
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
import { Analytics } from "@vercel/analytics/react";

const STORAGE_KEY = 'wlu-major-tracker-progress';

// Add a simple confirmation dialog component
function ConfirmDialog({ open, message, onConfirm, onCancel }: { open: boolean, message: string, onConfirm: () => void, onCancel: () => void }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#222', color: '#fff', padding: '2rem', borderRadius: '10px', minWidth: '300px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{message}</p>
        <button onClick={onConfirm} style={{ marginRight: '1rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '5px', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Yes</button>
        <button onClick={onCancel} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: '5px', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>No</button>
      </div>
    </div>
  );
}

function MajorPage({ majors, allProgress, setAllProgress, getCurrentProgress, handleToggle, handleCreditsChange, handleResetProgress, getProgress, ignoredEmphases, handleToggleEmphasis }: any) {
  const { majorName } = useParams();
  const navigate = useNavigate();
  const major = majors.find((m: Major) => m.major === decodeURIComponent(majorName || ''));
  const progress = useMemo(() => getProgress(major, ignoredEmphases?.[major?.major || '']), [getProgress, major, ignoredEmphases]);
  const currentProgress = getCurrentProgress(major);
  const [showConfirm, setShowConfirm] = useState(false);

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
          onClick={() => setShowConfirm(true)}
        >
          Reset Progress
        </button>
        <ConfirmDialog
          open={showConfirm}
          message="Are you sure you want to reset progress?"
          onConfirm={() => { setShowConfirm(false); handleResetProgress(major); }}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
      <h2>{major.major} Roadmap</h2>
      <Roadmap
        requirements={major.requirements}
        checked={currentProgress.checked}
        creditProgress={currentProgress.creditProgress}
        onToggle={(label, course) => handleToggle(major, label, course)}
        onCreditsChange={(label, credits) => handleCreditsChange(major, label, credits)}
        majorName={major.major}
        ignoredEmphases={ignoredEmphases?.[major.major]}
        handleToggleEmphasis={(track: string) => handleToggleEmphasis(major.major, track)}
      />
      {progress === 100 && <Celebration isComplete={true} />}
    </section>
  );
}

function HomePage({ majors, searchQuery, setSearchQuery, handleClearSearch, handleResetAllProgress }: any) {
  const [showConfirm, setShowConfirm] = useState(false);
  const filteredMajors = majors.filter((major: Major) => 
    major.major.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <section className="major-selection">
      <h2>Select a Major</h2>
      <button
        className="reset-all-progress-button"
        onClick={() => setShowConfirm(true)}
        style={{ marginBottom: '1.5rem', background: 'rgba(255,0,0,0.15)', color: '#fff', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '0.5rem', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 600 }}
      >
        Reset All Progress
      </button>
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to reset all progress?"
        onConfirm={() => { setShowConfirm(false); handleResetAllProgress(); }}
        onCancel={() => setShowConfirm(false)}
      />
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
  const [ignoredEmphases, setIgnoredEmphases] = useState<{ [major: string]: { [track: string]: boolean } }>({});

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

  const handleToggleEmphasis = useCallback((majorName: string, track: string) => {
    setIgnoredEmphases(prev => {
      const current = prev[majorName] || {};
      const tracks = majorTracks[majorName] || [];
      const next = { ...current, [track]: !current[track] };
      // With exactly two tracks they are a pair: ignoring one means doing the other.
      if (tracks.length === 2) {
        const other = tracks.find(t => t !== track);
        if (other) next[other] = !next[track] ? next[other] : false;
      }
      return { ...prev, [majorName]: next };
    });
  }, []);

  const getProgress = useCallback((major: Major | null, ignored?: { [track: string]: boolean }) => {
    if (!major) return 0;
    const currentProgress = getCurrentProgress(major);
    const { checked, creditProgress } = currentProgress;
    let total = 0;
    let completed = 0;
    const tracks = majorTracks[major.major] || [];
    major.requirements.forEach(req => {
      const track = tracks
        .filter(t => req.label.startsWith(t))
        .sort((a, b) => b.length - a.length)[0];
      if (track && ignored?.[track]) {
        // Not pursuing this track: count it as already satisfied rather than
        // holding the whole major below 100%.
        const weight = req.type === 'credits' && req.credits ? req.credits : req.courses ? req.courses.length : 1;
        total += weight;
        completed += weight;
        return;
      }
      if (req.type === 'credits' && req.credits) {
        total += req.credits;
        const currentCredits = creditProgress[req.label] || 0;
        completed += Math.min(currentCredits, req.credits);
      } else if (req.courses) {
        if (req.type === 'all') {
          // courses joined by "or" are alternatives: the pair counts once
          total += req.courses.length - countAlternativePairs(req.courses);
          completed += Math.min(
            req.courses.filter(course => checked[`${req.label}::${course}`]).length,
            req.courses.length - countAlternativePairs(req.courses)
          );
        } else if (req.type === 'one_of') {
          total += 1;
          const selectedCount = req.courses.filter(
            course => checked[`${req.label}::${course}`]
          ).length;
          if (selectedCount >= 1) {
            completed += 1;
          }
        } else if (req.type === 'n_of' && req.n) {
          total += req.n;
          const selectedCount = req.courses.filter(
            course => checked[`${req.label}::${course}`]
          ).length;
          completed += Math.min(selectedCount, req.n);
        }
      }
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [getCurrentProgress]);

  const handleHomeClick = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleResetAllProgress = useCallback(() => {
    setAllProgress({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear all progress:', error);
    }
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
                  handleResetAllProgress={handleResetAllProgress}
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
                  ignoredEmphases={ignoredEmphases}
                  handleToggleEmphasis={handleToggleEmphasis}
                />
              } />
            </Routes>
          </main>
        </div>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;