import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { RaceRunner, SlowestRaceConfig } from '../config/slowestRace';
import { RACE_DURATION_MS, slowestRaceWinner } from '../config/slowestRace';
import { AwardCelebration } from './AwardCelebration';

const START_DELAY_MS = 500;
const COUNTDOWN_MS = 1200;
const CELEBRATION_HOLD_MS = 5000;

const RACE_TICKER = [
  { atMs: 0, text: "And they're off!" },
  { atMs: 1800, text: 'Hunter storms into the lead!' },
  { atMs: 7000, text: 'Hunter still out in front…' },
  { atMs: 14000, text: "He's slowing — the pack is coming!" },
  { atMs: 22000, text: 'Parksy is closing fast!' },
  { atMs: 26500, text: 'Neck and neck — Hunter vs Parksy!' },
  { atMs: 29500, text: 'Photo finish… who\'s last?!' },
] as const;

interface SlowestRaceScreenProps {
  config: SlowestRaceConfig;
  active: boolean;
  onRaceComplete: () => void;
}

function RunnerHead({ runner, large }: { runner: RaceRunner; large?: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = runner.label
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (imgFailed) {
    return (
      <div
        className={`slowest-race__head slowest-race__head--fallback${large ? ' slowest-race__head--large' : ''}`}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      className={`slowest-race__head${large ? ' slowest-race__head--large' : ''}`}
      src={runner.headSrc}
      alt=""
      onError={() => setImgFailed(true)}
    />
  );
}

export function SlowestRaceScreen({
  config,
  active,
  onRaceComplete,
}: SlowestRaceScreenProps) {
  const [phase, setPhase] = useState<
    'idle' | 'countdown' | 'racing' | 'done' | 'celebrate'
  >('idle');
  const [tickerText, setTickerText] = useState<string>('Under orders…');
  const [hunterLeading, setHunterLeading] = useState(false);
  const [finaleDuel, setFinaleDuel] = useState(false);
  const completeRef = useRef(false);
  const notifiedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const winner = slowestRaceWinner(config);

  const clearTimers = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(window.setTimeout(fn, ms));
  };

  const reset = useCallback(() => {
    clearTimers();
    completeRef.current = false;
    notifiedRef.current = false;
    setPhase('idle');
    setTickerText('Under orders…');
    setHunterLeading(false);
    setFinaleDuel(false);
  }, []);

  useEffect(() => {
    if (!active) {
      reset();
      return;
    }

    reset();
    const raceStart = START_DELAY_MS + COUNTDOWN_MS;
    const raceEnd = raceStart + RACE_DURATION_MS + 500;
    const celebrateStart = raceEnd + 350;

    schedule(() => setPhase('countdown'), START_DELAY_MS);
    schedule(() => {
      setPhase('racing');
      setHunterLeading(true);
    }, raceStart);

    for (const cue of RACE_TICKER) {
      schedule(() => setTickerText(cue.text), raceStart + cue.atMs);
    }

    schedule(() => setHunterLeading(false), raceStart + 14000);
    schedule(() => setFinaleDuel(true), raceStart + 24000);
    schedule(() => setFinaleDuel(false), raceStart + RACE_DURATION_MS + 200);

    schedule(() => {
      setPhase('done');
      setTickerText('Last across the line…');
    }, raceEnd);

    schedule(() => {
      setPhase('celebrate');
      setTickerText('We have a winner!');
    }, celebrateStart);

    schedule(() => {
      completeRef.current = true;
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onRaceComplete();
      }
    }, celebrateStart + CELEBRATION_HOLD_MS);

    return () => clearTimers();
  }, [active, onRaceComplete, reset]);

  useEffect(() => {
    if (!active || phase === 'idle') return undefined;

    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'ArrowRight') return;
      if (!completeRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active, phase]);

  useEffect(() => () => clearTimers(), []);

  const racing = phase === 'racing' || phase === 'done' || phase === 'celebrate';
  const showResult = phase === 'done' || phase === 'celebrate';
  const showCelebrate = phase === 'celebrate';

  const displayTicker =
    phase === 'countdown'
      ? 'Under orders…'
      : showCelebrate
        ? tickerText
        : showResult
          ? 'Photo finish — last across wins'
          : tickerText;

  return (
    <div
      className="slowest-race"
      style={{ ['--race-duration' as string]: `${RACE_DURATION_MS}ms` }}
      aria-live="polite"
    >
      <div
        className={`slowest-race__board${showCelebrate ? ' slowest-race__board--dimmed' : ''}`}
      >
        <div className="slowest-race__ticker">
          <span className="slowest-race__ticker-label">Live</span>
          <span className="slowest-race__ticker-text">{displayTicker}</span>
        </div>

        <div className="slowest-race__track-wrap">
          <div className="slowest-race__finish" aria-hidden>
            <span className="slowest-race__finish-label">Finish</span>
          </div>

          <ul className="slowest-race__lanes">
            {config.runners.map((runner, laneIndex) => {
              const isWinner = runner.id === winner.id;
              const isHunter = runner.id === 'hunter';
              const isParksy = runner.id === 'parksy';

              return (
                <li
                  key={runner.id}
                  className={[
                    'slowest-race__lane',
                    showResult && isWinner ? 'slowest-race__lane--winner' : '',
                    racing && hunterLeading && isHunter ? 'slowest-race__lane--leading' : '',
                    racing && finaleDuel && (isHunter || isParksy)
                      ? 'slowest-race__lane--duel'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="slowest-race__lane-no">{laneIndex + 1}</span>
                  <div className="slowest-race__lane-track">
                    <div
                      className={[
                        'slowest-race__racer',
                        racing ? 'slowest-race__racer--go' : '',
                        racing ? `slowest-race__racer--${runner.id}` : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{
                        animationDelay: racing ? `${laneIndex * 70}ms` : undefined,
                      }}
                    >
                      <div className="slowest-race__racer-bob">
                        <RunnerHead runner={runner} />
                      </div>
                      <span className="slowest-race__racer-name">{runner.label}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {showCelebrate && (
          <motion.div
            className="slowest-race__celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <AwardCelebration />
            <motion.div
              className="slowest-race__winner-card"
              role="alert"
              initial={{ opacity: 0, scale: 0.55, y: 48 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: 'spring',
                damping: 16,
                stiffness: 220,
                delay: 0.08,
              }}
            >
              <div className="slowest-race__winner-card-frame">
                <p className="slowest-race__winner-eyebrow">Last across the line</p>
                <div className="slowest-race__winner-head-wrap">
                  <RunnerHead runner={winner} large />
                </div>
                <h3 className="slowest-race__winner-name">{winner.label}</h3>
                <p className="slowest-race__winner-tag">Slowest in the Squad</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
