import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  leagueTable2425,
  leagueTable2526,
  isBmfcRow,
  type LeagueRow,
} from '../config/leagueTables';

const smoothEase = [0.4, 0, 0.2, 1] as const;
const BMFC_FROM_INDEX = 8; // 9th place
const BMFC_TO_INDEX = 2; // 3rd place

const TIMING = {
  blurIn: 900,
  swapOthers: 400,
  bmfcMove: 3200,
  revealOthers: 1000,
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
  const [bmfcRowIndex, setBmfcRowIndex] = useState(BMFC_FROM_INDEX);
  const [bmfcRowData, setBmfcRowData] = useState(
    slots2425.find((r) => isBmfcRow(r.club))!,
  );
  const [complete, setComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const completeRef = useRef(false);
  const timeouts = useRef<number[]>([]);

  const bmfcBadgePosition = complete ? 3 : 9;

  const clearTimers = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeouts.current.push(id);
  };

  const runTransition = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);

    let t = 0;

    schedule(() => setOthersBlur(true), (t += TIMING.blurIn));

    schedule(() => {
      setSlotRows(slots2526);
      setBmfcFloating(true);
    }, (t += TIMING.swapOthers));

    schedule(() => setBmfcRowIndex(BMFC_TO_INDEX), (t += 120));

    schedule(() => {
      setBmfcRowData(bmfc2526);
    }, (t += TIMING.bmfcMove - 500));

    schedule(() => {
      setBmfcFloating(false);
      setSlotRows(slots2526);
      setSeasonLabel('2025/26');
      setComplete(true);
      completeRef.current = true;
    }, (t += TIMING.bmfcMove));

    schedule(() => setOthersBlur(false), (t += TIMING.revealOthers));
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

        <motion.p
          className="league-slide-subtitle"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Final League Table {seasonLabel}
          <span className="league-slide-subtitle__comp">{subtitle}</span>
        </motion.p>

        <motion.div
          className="league-bmfc-badge"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          Bishop Middleham FC —{' '}
          <motion.span
            className="league-bmfc-badge__pos"
            key={bmfcBadgePosition}
            initial={{ opacity: 0.4, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: smoothEase }}
          >
            {ordinalPlace(bmfcBadgePosition)}
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
                  const hideForFloat =
                    bmfcFloating &&
                    (index === BMFC_FROM_INDEX || index === bmfcRowIndex);

                  if (hideForFloat) {
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

                  return (
                    <motion.tr
                      key={`slot-${index}`}
                      className={isBmfcRow(row.club) ? 'league-row--bmfc' : undefined}
                      animate={{
                        filter: othersBlur ? 'blur(7px)' : 'blur(0px)',
                        opacity: othersBlur ? 0.2 : 1,
                      }}
                      transition={{
                        filter: { duration: TIMING.blurIn / 1000, ease: smoothEase },
                        opacity: { duration: TIMING.blurIn / 1000, ease: smoothEase },
                      }}
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
                initial={{ top: `calc(${BMFC_FROM_INDEX} * var(--league-row-height))` }}
                animate={{
                  top: `calc(${bmfcRowIndex} * var(--league-row-height))`,
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

        {!complete && (
          <motion.p
            className="league-progress-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: started ? 0.35 : 0.5 }}
          >
            {started ? 'Climbing the table…' : 'Click or press Space to begin'}
          </motion.p>
        )}
      </div>
    </div>
  );
}
