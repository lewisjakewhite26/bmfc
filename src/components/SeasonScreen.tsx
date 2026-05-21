import { motion } from 'framer-motion';
import type { SeasonSlide } from '../config/season';
import { LeagueTableScreen } from './LeagueTableScreen';

const celebrateEase = [0.34, 1.56, 0.64, 1] as const;

interface SeasonScreenProps {
  slide: SeasonSlide;
}

export function SeasonScreen({ slide }: SeasonScreenProps) {
  if (slide.type === 'league-journey') {
    return <LeagueTableScreen title={slide.title} phase={slide.phase} />;
  }

  return (
    <div className="screen-container season-screen fade-in-out">
      <div className="season-slide-wrap">
        {slide.type === 'title' && (
          <>
            <h1 className="intro-title">{slide.title}</h1>
            {slide.subtitle && <p className="intro-summary">{slide.subtitle}</p>}
          </>
        )}

        {slide.type === 'stats' && (
          <>
            <h2 className="award-category award-category--compact">{slide.title}</h2>
            <dl className="season-stat-grid">
              {slide.items.map((item) => (
                <div key={item.label} className="season-stat">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {slide.type === 'scorers' && (
          <>
            <h2 className="award-category award-category--compact">{slide.title}</h2>
            <table className="season-table">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Goals</th>
                </tr>
              </thead>
              <tbody>
                {slide.rows.map((row) => (
                  <tr key={row.player}>
                    <td>{row.player}</td>
                    <td>{row.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {slide.type === 'highlights' && (
          <>
            <h2 className="award-category award-category--compact">{slide.title}</h2>
            <ul className="season-highlights">
              {slide.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </>
        )}

        {slide.type === 'section-intro' && (
          <div className="season-slide-wrap season-slide-wrap--awards-intro">
            <motion.h1
              className="awards-intro-title"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: celebrateEase }}
            >
              {slide.title}
            </motion.h1>
            {slide.lines && slide.lines.length > 0 && (
              <ul className="season-highlights season-section-intro">
                {slide.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
