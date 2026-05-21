import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Slideshow } from './components/Slideshow';
import { Marquee } from './components/Marquee';
import { AwardScreen } from './components/AwardScreen';
import { AwardBackground } from './components/AwardBackground';
import { SeasonScreen } from './components/SeasonScreen';
import { IntroScreen } from './components/IntroScreen';
import { TransitionScreen } from './components/TransitionScreen';
import { MainAwardsInterlude } from './components/MainAwardsInterlude';
import { isMainAwardsInterlude } from './config/transitions';
import {
  awards,
  introConfig,
  INTRO_SCREEN_COUNT,
  resolveAwardSectionScreen,
  totalAwardScreens,
} from './config/awards';
import { SEASON_SLIDE_COUNT, seasonSlides } from './config/season';

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Screens: landing (0) → intro (×N) → season → awards → thank you
  const introStart = 1;
  const seasonStart = introStart + INTRO_SCREEN_COUNT;
  const awardStart = seasonStart + SEASON_SLIDE_COUNT;
  const awardScreenCount = totalAwardScreens();
  const maxIndex = awardStart + awardScreenCount;
  const isIntroScreen =
    screenIndex >= introStart && screenIndex < seasonStart;
  const isSeasonScreen =
    screenIndex >= seasonStart && screenIndex < awardStart;
  const isAwardScreen =
    screenIndex >= awardStart &&
    screenIndex < awardStart + awardScreenCount;
  const usesAwardBackground =
    isIntroScreen || isSeasonScreen || isAwardScreen;

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

    if (isIntroScreen) {
      const introIndex = screenIndex - introStart;
      return (
        <IntroScreen
          key="intro"
          title={introConfig.title}
          paragraphs={introConfig.paragraphs}
          visibleParagraphCount={introIndex + 1}
        />
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

    const awardSection = resolveAwardSectionScreen(screenIndex, awardStart);

    if (awardSection?.kind === 'interlude') {
      const { slide } = awardSection;
      if (isMainAwardsInterlude(slide)) {
        return (
          <MainAwardsInterlude
            key="interlude-main-awards"
            title={slide.title}
            season={slide.season}
          />
        );
      }
      return (
        <TransitionScreen
          key={`interlude-${slide.title}`}
          title={slide.title}
          lines={slide.lines}
        />
      );
    }

    if (awardSection?.kind === 'award') {
      const { awardIndex, awardStep } = awardSection;
      return (
        <AnimatePresence mode="wait">
          <AwardScreen
            key={awardIndex}
            award={awards[awardIndex]}
            awardStep={awardStep}
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
