import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Slideshow } from './components/Slideshow';
import { Marquee } from './components/Marquee';
import { AwardScreen } from './components/AwardScreen';
import { AwardBackground } from './components/AwardBackground';
import { SeasonScreen } from './components/SeasonScreen';
import { IntroScreen } from './components/IntroScreen';
import { TransitionScreen } from './components/TransitionScreen';
import { MainAwardsInterlude } from './components/MainAwardsInterlude';
import { ModePickerScreen } from './components/ModePickerScreen';
import { isMainAwardsInterlude } from './config/transitions';
import {
  introConfig,
  INTRO_SCREEN_COUNT,
  resolveAwardSectionScreen,
  totalAwardScreens,
} from './config/awards';
import {
  composeAwards,
  interludesForFlow,
  type PresentationFlow,
} from './config/presentationFlow';
import { SEASON_SLIDE_COUNT, seasonSlides } from './config/season';
import { useFullscreen } from './hooks/useFullscreen';

export default function App() {
  const [flowMode, setFlowMode] = useState<PresentationFlow | null>(null);
  const [screenIndex, setScreenIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { isFullscreen, enter: enterFullscreen, toggle: toggleFullscreen } =
    useFullscreen();
  const composedAwards = useMemo(
    () => (flowMode ? composeAwards(flowMode) : []),
    [flowMode],
  );
  const interludes = useMemo(
    () => (flowMode ? interludesForFlow(flowMode) : {}),
    [flowMode],
  );

  const introStart = 1;
  const seasonStart = introStart + INTRO_SCREEN_COUNT;
  const awardStart = seasonStart + SEASON_SLIDE_COUNT;
  const awardScreenCount = flowMode
    ? totalAwardScreens(composedAwards, interludes)
    : 0;
  const maxIndex = awardStart + awardScreenCount;

  const awardSection =
    flowMode !== null && screenIndex >= awardStart && screenIndex < awardStart + awardScreenCount
      ? resolveAwardSectionScreen(
          screenIndex,
          awardStart,
          composedAwards,
          interludes,
        )
      : null;

  const isIntroScreen =
    flowMode !== null &&
    screenIndex >= introStart &&
    screenIndex < seasonStart;
  const isSeasonScreen =
    flowMode !== null &&
    screenIndex >= seasonStart &&
    screenIndex < awardStart;
  const isAwardSlide = awardSection?.kind === 'award' || awardSection?.kind === 'interlude';
  const usesAwardBackground = isIntroScreen || isSeasonScreen || isAwardSlide;
  const isLandingScreen = flowMode !== null && screenIndex === 0;

  const selectFlow = (flow: PresentationFlow) => {
    setFlowMode(flow);
    setScreenIndex(0);
    void enterFullscreen();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        void toggleFullscreen();
        return;
      }

      if (flowMode === null) return;

      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        setScreenIndex((prevIndex) =>
          prevIndex < maxIndex ? prevIndex + 1 : prevIndex,
        );
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setScreenIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [flowMode, maxIndex, toggleFullscreen]);

  const renderActiveScreen = () => {
    if (flowMode === null) {
      return <ModePickerScreen onSelect={selectFlow} />;
    }

    if (screenIndex === 0) {
      return (
        <div key="landing" className="screen-container landing-screen fade-in-out">
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

    if (awardSection?.kind === 'interlude') {
      const { slide } = awardSection;
      if (isMainAwardsInterlude(slide)) {
        return (
          <MainAwardsInterlude
            key={`interlude-${slide.title}`}
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
            award={composedAwards[awardIndex]}
            awardStep={awardStep}
          />
        </AnimatePresence>
      );
    }

    return (
      <div key="conclusion" className="screen-container fade-in-out">
        <Marquee />

        <div className="crest-wrap">
          <div className="crest-halo" />
          <img className="crest-img" src="/crest.png" alt="Bishop Middleham FC Crest" />
        </div>

        <h1 className="club-name">Bishop Middleham FC</h1>
        <div className="season-text" style={{ marginTop: '1rem', letterSpacing: '0.4em' }}>
          2025 &middot; 26
        </div>

        <p className="intro-summary" style={{ marginTop: '2rem' }}>
          Thank you for joining us tonight.
        </p>
      </div>
    );
  };

  const showNavForward = flowMode !== null && screenIndex < maxIndex;
  return (
    <>
      {isLandingScreen && (
        <Slideshow
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
        />
      )}

      {usesAwardBackground && <AwardBackground />}

      <div
        className={`overlay-gradient${isLandingScreen ? ' overlay-gradient--landing' : ''}${usesAwardBackground ? ' overlay-gradient--awards' : ''}${flowMode === null ? ' overlay-gradient--picker' : ''}`}
      />
      <div className={`overlay-sides${usesAwardBackground ? ' overlay-sides--awards' : ''}`} />
      <div className={`overlay-colour${usesAwardBackground ? ' overlay-colour--awards' : ''}`} />
      <div className="grain" />

      {flowMode !== null && screenIndex > 0 && (
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

      {showNavForward && (
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

      <button
        type="button"
        className="fullscreen-btn"
        onClick={() => void toggleFullscreen()}
        aria-label={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
        title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        )}
      </button>

      {renderActiveScreen()}
    </>
  );
}
