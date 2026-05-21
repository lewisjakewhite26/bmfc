import { useState } from 'react';
import { motion } from 'framer-motion';

const smoothEase = [0.4, 0, 0.2, 1] as const;
const lineIn = { duration: 1.5, ease: smoothEase, delay: 0.35 };

interface IntroScreenProps {
  title: string;
  paragraphs: string[];
  /** How many paragraphs to show on this screen (1-based). */
  visibleParagraphCount: number;
}

export function IntroScreen({
  title,
  paragraphs,
  visibleParagraphCount,
}: IntroScreenProps) {
  const [settledParagraphs, setSettledParagraphs] = useState(
    () => new Set<number>(),
  );
  const [titleSettled, setTitleSettled] = useState(false);

  const visible = paragraphs.slice(0, visibleParagraphCount);
  const newestIndex = visibleParagraphCount - 1;

  const markParagraphSettled = (index: number) => {
    setSettledParagraphs((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <div className="screen-container intro-screen">
      <div className="intro-text-wrap">
        <div className="intro-title-slot">
          {titleSettled ? (
            <h1 className="intro-title intro-title--settled">{title}</h1>
          ) : (
            <motion.h1
              className="intro-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: smoothEase, delay: 0.2 }}
              onAnimationComplete={() => setTitleSettled(true)}
            >
              {title}
            </motion.h1>
          )}
        </div>

        <div className="intro-lines">
          {visible.map((line, index) => {
            const animate =
              index === newestIndex && !settledParagraphs.has(index);

            if (animate) {
              return (
                <motion.p
                  key={index}
                  className="intro-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={lineIn}
                  onAnimationComplete={() => markParagraphSettled(index)}
                >
                  {line}
                </motion.p>
              );
            }

            return (
              <p key={index} className="intro-line">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
