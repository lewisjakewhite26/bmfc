import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  leagueTable2425,
  leagueTable2526,
  isBmfcRow,
  type LeagueRow,
} from '../config/leagueTables';

const smoothEase = [0.4, 0, 0.2, 1] as const;
const BMFC_FROM_INDEX = 8;
const BMFC_TO_INDEX = 2;

const TIMING = {
  blurIn: 650,
  swapDelay: 200,
  bmfcMove: 3000,
  land: 320,
};

function ordinalPlace(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const mod10 = n % 10;
  if (mod10 === 1) return `${n}st`;
  if (mod10 === 2) return `${n}nd`;
  if (mod10 === 3) return `${n}rd`;
  return `${n}th`;
}

function byPosition(rows: LeagueRow[]) {
  return [...rows].sort((a, b) => a.position - b.position);
}

const slots2425 = byPosition(leagueTable2425);
const slots2526 = byPosition(leagueTable2526);
const bmfc2525 = slots2425[BMFC_FROM_INDEX];
const bmfc2526 = slots2526[BMFC_TO_INDEX];

interface LeagueTableScreenProps {
  title: string;
  subtitle?: string;
}

function LeagueRowCells({ row }: { row: LeagueRow }) {
  return (
    <>
      <td className="league-table__pos">{row.position}</td>
      <td className="league-table__club">
        {row.club}
        {row.deducted && <span className="league-table__deducted"> *</span>}
      </td>
      <td>{row.p}</td>
      <td>{row.w}</td>
      <td>{row.d}</td>
      <td>{row.l}</td>
      <td className="league-table__gd">{row.gd >= 0 ? `+${row.gd}` : row.gd}</td>
      <td className="league-table__pts">{row.pts}</td>
    </>
  );
}

export function LeagueTableScreen({
  title,
  subtitle = 'Swinburne Maddison Third Division',
}: LeagueTableScreenProps) {
  const [slotRows, setSlotRows] = useState(slots2425);
  const [seasonLabel, setSeasonLabel] = useState('2024/25');
  const [othersBlur, setOthersBlur] = useState(false);
  const [bmfcFloating, setBmfcFloating] = useState(false);
  const [bmfcRowData, setBmfcRowData] = useState(bmfc2525);
  const [complete, setComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const completeRef = useRef(false);
  const timeouts = useRef<number[]>([]);

  const clearTimers = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    timeouts.current.push(window.setTimeout(fn, ms));
  };

  const runTransition = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);

    let t = 0;

    // Other clubs blur, then swap to 2025/26 names in place
    schedule(() => setOthersBlur(true), (t += TIMING.blurIn));
    schedule(() => {
      setSlotRows(
        slots2526.map((row, i) => (i === BMFC_TO_INDEX ? slots2425[BMFC_TO_INDEX] : row)),
      );
    }, (t += TIMING.swapDelay));

    // BMFC lifts from 9th and climbs — only one gap (old 9th row)
    schedule(() => {
      setBmfcFloating(true);
      setBmfcRowData(bmfc2525);
    }, (t += 80));

    // Land: settle into table, reveal everyone, update season — one beat
    schedule(() => {
      setBmfcFloating(false);
      setSlotRows(slots2526);
      setBmfcRowData(bmfc2526);
      setSeasonLabel('2025/26');
      setOthersBlur(false);
      setComplete(true);
      completeRef.current = true;
    }, (t += TIMING.bmfcMove));
  }, []);

  const handleStart = useCallback(() => {
    if (!startedRef.current) runTransition();
  }, [runTransition]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'ArrowRight') return;

      if (!startedRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
        runTransition();
        return;
      }

      if (!completeRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [runTransition]);

  useEffect(() => () => clearTimers(), []);

  const blurTransition = {
    filter: { duration: TIMING.land / 1000, ease: smoothEase },
    opacity: { duration: TIMING.land / 1000, ease: smoothEase },
  };

  return (
    <div
      className={`screen-container season-screen fade-in-out${!started ? ' league-slide--awaiting' : ''}`}
      onClick={!started ? handleStart : undefined}
      role={!started ? 'button' : undefined}
      tabIndex={!started ? 0 : undefined}
    >
      <div className="season-slide-wrap league-slide-wrap">
        <h2 className="award-category award-category--compact league-slide-title">
          {title}
        </h2>

        <p className="league-slide-subtitle">
          Final League Table {seasonLabel}
          <span className="league-slide-subtitle__comp">{subtitle}</span>
        </p>

        <motion.div
          className="league-bmfc-badge"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: smoothEase }}
        >
          Bishop Middleham FC —{' '}
          <motion.span
            className="league-bmfc-badge__pos"
            key={complete ? 'final' : 'start'}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: TIMING.land / 1000, ease: smoothEase }}
          >
            {ordinalPlace(complete ? 3 : 9)}
          </motion.span>
        </motion.div>

        <div className="league-table-scroll">
          <div className="league-table-body">
            <table className="league-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Club</th>
                  <th scope="col">P</th>
                  <th scope="col">W</th>
                  <th scope="col">D</th>
                  <th scope="col">L</th>
                  <th scope="col">GD</th>
                  <th scope="col">Pts</th>
                </tr>
              </thead>
              <tbody>
                {slotRows.map((row, index) => {
                  if (bmfcFloating && index === BMFC_FROM_INDEX) {
                    return (
                      <tr
                        key={`slot-${index}-spacer`}
                        className="league-row--spacer"
                        aria-hidden
                      >
                        <td colSpan={8} />
                      </tr>
                    );
                  }

                  const isBmfcSlot = !bmfcFloating && isBmfcRow(row.club);

                  return (
                    <motion.tr
                      key={`slot-${index}`}
                      className={isBmfcSlot ? 'league-row--bmfc' : undefined}
                      animate={{
                        filter: othersBlur && !isBmfcSlot ? 'blur(6px)' : 'blur(0px)',
                        opacity: othersBlur && !isBmfcSlot ? 0.25 : 1,
                      }}
                      transition={blurTransition}
                    >
                      <LeagueRowCells row={row} />
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {bmfcFloating && (
              <motion.div
                className="league-floating-row"
                initial={{
                  top: `calc(${BMFC_FROM_INDEX} * var(--league-row-height))`,
                }}
                animate={{
                  top: `calc(${BMFC_TO_INDEX} * var(--league-row-height))`,
                }}
                transition={{
                  duration: TIMING.bmfcMove / 1000,
                  ease: smoothEase,
                }}
              >
                <table className="league-table league-table--floating">
                  <tbody>
                    <tr className="league-row--bmfc">
                      <LeagueRowCells row={bmfcRowData} />
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </div>

        {!started && (
          <p className="league-progress-hint">Click or press Space to begin</p>
        )}
        {started && !complete && (
          <p className="league-progress-hint league-progress-hint--climbing">
            Climbing the table…
          </p>
        )}
      </div>
    </div>
  );
}
