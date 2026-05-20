import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { Award } from '../config/awards';
import { seasonLabel } from '../config/awards';

/** Cinematic ease — slow in/out for presentation pacing */
const smoothEase = [0.4, 0, 0.2, 1] as const;

const morph = { duration: 2.2, ease: smoothEase };
const fade = { duration: 1.4, ease: smoothEase };
const contentIn = { duration: 1.65, ease: smoothEase, delay: 0.75 };
const contentOut = { duration: 1.2, ease: smoothEase };
/** Winner reveal — 4s blur-to-sharp build-up */
const winnerReveal = {
  opacity: { duration: 3, ease: smoothEase, delay: 0.7 },
  scale: { duration: 3.1, ease: smoothEase, delay: 0.65 },
  filter: { duration: 3.25, ease: smoothEase, delay: 0.75 },
};

interface AwardScreenProps {
  award: Award;
  awardStep: number;
  awardIndex: number;
}

export function AwardScreen({ award, awardStep, awardIndex }: AwardScreenProps) {
  const isCompact = awardStep === 1 || awardStep === 3;

  return (
    <motion.div
      className="screen-container award-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fade}
    >
      <LayoutGroup id={`award-${awardIndex}`}>
        <div className="award-container">
          <motion.h2
            layoutId={`award-title-${awardIndex}`}
            layout
            className={
              isCompact
                ? 'award-category award-category--compact'
                : 'award-category'
            }
            transition={{ layout: morph }}
          >
            {award.category}
          </motion.h2>

          <AnimatePresence mode="popLayout">
            {awardStep === 1 && (
              <motion.div
                key="description"
                className="award-description-wrap"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: contentOut }}
                transition={contentIn}
              >
                <p className="award-description">{award.description}</p>
              </motion.div>
            )}

            {awardStep === 2 && (
              <motion.p
                key="season"
                layoutId={`award-season-${awardIndex}`}
                layout
                className="award-season"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: contentOut }}
                transition={{
                  layout: morph,
                  opacity: contentIn,
                  y: contentIn,
                }}
              >
                {seasonLabel}
              </motion.p>
            )}

            {awardStep === 3 && (
              <motion.h3
                key="winner"
                className="award-winner"
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(16px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  filter: 'blur(6px)',
                  transition: { ...contentOut, duration: 1.35 },
                }}
                transition={winnerReveal}
              >
                {award.winner}
              </motion.h3>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </motion.div>
  );
}
