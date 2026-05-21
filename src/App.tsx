import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Slideshow } from './components/Slideshow';
import { Marquee } from './components/Marquee';
import { AwardScreen } from './components/AwardScreen';
import { AwardBackground } from './components/AwardBackground';
import { SeasonScreen } from './components/SeasonScreen';
import { awards, introConfig, SCREENS_PER_AWARD } from './config/awards';
import { SEASON_SLIDE_COUNT, seasonSlides } from './config/season';

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Screens: landing (0) → intro (1) → season → 4 per award → thank you
  const numAwards = awards.length;
  const seasonStart = 2;
  const awardStart = seasonStart + SEASON_SLIDE_COUNT;
  const maxIndex = 1 + SEASON_SLIDE_COUNT + SCREENS_PER_AWARD * numAwards + 1;
  const isSeasonScreen =
    screenIndex >= seasonStart && screenIndex < awardStart;
  const isAwardScreen =
    screenIndex >= awardStart &&
    screenIndex < awardStart + SCREENS_PER_AWARD * numAwards;
  const usesAwardBackground = isSeasonScreen || isAwardScreen;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault(); // Prevent page scrolling/spacebar defaults
        setScreenIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : prevIndex));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault(); // Prevent page scrolling/defaults
        setScreenIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [maxIndex]);

  // Determine what to render based on the current screenIndex
  const renderActiveScreen = () => {
    if (screenIndex === 0) {
      // 1. Landing Screen
      return (
        <div key="landing" className="screen-container landing-screen fade-in-out">
          {/* Scrolling Marquee behind the badge */}
          <Marquee />

          <div className="crest-wrap">
            <div className="crest-halo" />
            <img className="crest-img" src="/crest.png" alt="Bishop Middleham FC Crest" />
          </div>

          <h1 className="club-name">Bishop Middleham<br />Football Club</h1>

          <div className="season-line">
            <div className="season-rule" />
            <span className="season-text">2025 &middot; 26</span>
            <div className="season-rule right" />
          </div>

          <div className="subtitle">Presentation Evening</div>
        </div>
      );
    }

    if (screenIndex === 1) {
      // 2. Introduction Screen
      return (
        <div key="intro" className="screen-container fade-in-out">
          <div className="intro-text-wrap">
            <h1 className="intro-title">{introConfig.title}</h1>
            <p className="intro-summary">{introConfig.summary}</p>
          </div>
        </div>
      );
    }

    if (isSeasonScreen) {
      const seasonIndex = screenIndex - seasonStart;
      return (
        <SeasonScreen
          key={`season-${seasonIndex}`}
          slide={seasonSlides[seasonIndex]}
        />
      );
    }

    // Award screens: title → description → title + season → winner
    const awardOffsetIndex = screenIndex - awardStart;
    const awardIndex = Math.floor(awardOffsetIndex / SCREENS_PER_AWARD);
    const awardStep = awardOffsetIndex % SCREENS_PER_AWARD;

    if (awardIndex < numAwards) {
      return (
        <AnimatePresence mode="wait">
          <AwardScreen
            key={awardIndex}
            award={awards[awardIndex]}
            awardStep={awardStep}
            awardIndex={awardIndex}
          />
        </AnimatePresence>
      );
    }

    // 4. Concluding Screen (Thank You)
    return (
      <div key="conclusion" className="screen-container fade-in-out">
        {/* Soft fading marquee on final screen */}
        <Marquee />

        <div className="crest-wrap">
          <div className="crest-halo" />
          <img className="crest-img" src="/crest.png" alt="Bishop Middleham FC Crest" />
        </div>

        <h1 className="club-name">Bishop Middleham FC</h1>
        <div className="season-text" style={{ marginTop: '1rem', letterSpacing: '0.4em' }}>2025 &middot; 26</div>

        <p className="intro-summary" style={{ marginTop: '2rem' }}>
          Thank you for joining us tonight.
        </p>
      </div>
    );
  };

  return (
    <>
      {/* Background Slideshow - only on landing page (screenIndex === 0) */}
      {screenIndex === 0 && (
        <Slideshow 
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
        />
      )}

      {usesAwardBackground && <AwardBackground />}

      {/* Cinematic Vignettes and Color Gradients */}
      <div
        className={`overlay-gradient${screenIndex === 0 ? ' overlay-gradient--landing' : ''}${usesAwardBackground ? ' overlay-gradient--awards' : ''}`}
      />
      <div className={`overlay-sides${usesAwardBackground ? ' overlay-sides--awards' : ''}`} />
      <div className={`overlay-colour${usesAwardBackground ? ' overlay-colour--awards' : ''}`} />
      <div className="grain" />
      {/* Subtle Navigation Chevrons in Top Corners */}
      {screenIndex > 0 && (
        <button 
          className="nav-arrow left" 
          onClick={() => setScreenIndex((prev) => prev - 1)}
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      {screenIndex < maxIndex && (
        <button 
          className="nav-arrow right" 
          onClick={() => setScreenIndex((prev) => prev + 1)}
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}

      {/* Presentation Content */}
      {renderActiveScreen()}
    </>
  );
}
