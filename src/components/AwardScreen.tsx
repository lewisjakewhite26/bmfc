import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Award } from '../config/awards';
import { seasonLabel } from '../config/awards';
import { useSettledReveal } from '../hooks/useSettledReveal';
import {
  awardBetweenScreen,
  awardFadeIn,
  awardWinnerIn,
  type AwardPace,
} from '../motion/awardMotion';

interface AwardScreenProps {
  award: Award;
  awardStep: number;
}

interface CumulativeBlockProps {
  stepId: number;
  visible: boolean;
  pace: AwardPace;
  className?: string;
  shouldAnimate: (id: number, isVisible: boolean) => boolean;
  markSettled: (id: number) => void;
  children: ReactNode;
  /** Joke winner: slight rise-in */
  liftIn?: boolean;
}

function CumulativeBlock({
  stepId,
  visible,
  pace,
  className,
  shouldAnimate,
  markSettled,
  children,
  liftIn = false,
}: CumulativeBlockProps) {
  if (!visible) return null;

  const runEntrance = shouldAnimate(stepId, true);
  const winnerMotion = liftIn ? awardWinnerIn(pace) : null;

  if (runEntrance) {
    return (
      <motion.div
        className={className}
        initial={
          liftIn && winnerMotion
            ? { opacity: 0, y: winnerMotion.initialY }
            : { opacity: 0 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={
          liftIn && winnerMotion
            ? { opacity: winnerMotion.opacity, y: winnerMotion.y }
            : awardFadeIn(pace)
        }
        onAnimationComplete={() => markSettled(stepId)}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={className}>{children}</div>;
}

function AwardHeader({
  title,
  titleClassName,
  headerClassName = 'award-header',
  pace,
  shouldAnimate,
  markSettled,
}: {
  title: string;
  titleClassName: string;
  headerClassName?: string;
  pace: AwardPace;
  shouldAnimate: (id: number, isVisible: boolean) => boolean;
  markSettled: (id: number) => void;
}) {
  const runTitle = shouldAnimate(0, true);

  return (
    <div className={headerClassName}>
      {runTitle ? (
        <motion.h2
          className={titleClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={awardFadeIn(pace, 0)}
          onAnimationComplete={() => markSettled(0)}
        >
          {title}
        </motion.h2>
      ) : (
        <h2 className={titleClassName}>{title}</h2>
      )}
      <p className="award-season award-season--header" aria-hidden={false}>
        {seasonLabel}
      </p>
    </div>
  );
}

function JokeAwardScreen({
  award,
  awardStep,
}: AwardScreenProps) {
  const pace: AwardPace = 'joke';
  const { shouldAnimate, markSettled } = useSettledReveal();

  return (
    <div className="award-container award-container--stacked">
      <AwardHeader
        title={award.category}
        titleClassName="award-category"
        pace={pace}
        shouldAnimate={shouldAnimate}
        markSettled={markSettled}
      />

      <div className="award-body">
        <CumulativeBlock
          stepId={1}
          visible={awardStep >= 1}
          pace={pace}
          className="award-description-wrap"
          shouldAnimate={shouldAnimate}
          markSettled={markSettled}
        >
          <p className="award-description">{award.description}</p>
        </CumulativeBlock>

        <CumulativeBlock
          stepId={2}
          visible={awardStep >= 2}
          pace={pace}
          className="award-winner-wrap"
          shouldAnimate={shouldAnimate}
          markSettled={markSettled}
          liftIn
        >
          <h3 className="award-winner">{award.winner}</h3>
        </CumulativeBlock>
      </div>
    </div>
  );
}

function SeriousAwardScreen({ award, awardStep }: AwardScreenProps) {
  const pace: AwardPace = 'serious';
  const { shouldAnimate, markSettled } = useSettledReveal();

  return (
    <div className="award-container award-container--stacked">
      <AwardHeader
        title={award.category}
        titleClassName="award-category"
        pace={pace}
        shouldAnimate={shouldAnimate}
        markSettled={markSettled}
      />

      <div className="award-body">
        <CumulativeBlock
          stepId={1}
          visible={awardStep >= 1}
          pace={pace}
          className="award-description-wrap"
          shouldAnimate={shouldAnimate}
          markSettled={markSettled}
        >
          <p className="award-description">{award.description}</p>
        </CumulativeBlock>
      </div>
    </div>
  );
}

export function AwardScreen({ award, awardStep }: AwardScreenProps) {
  const pace: AwardPace = award.type;

  return (
    <motion.div
      className="screen-container award-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={awardBetweenScreen(pace)}
    >
      {award.type === 'joke' ? (
        <JokeAwardScreen award={award} awardStep={awardStep} />
      ) : (
        <SeriousAwardScreen award={award} awardStep={awardStep} />
      )}
    </motion.div>
  );
}
