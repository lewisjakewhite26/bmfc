import type { SeasonSlide } from '../config/season';
import { LeagueTableScreen } from './LeagueTableScreen';

interface SeasonScreenProps {
  slide: SeasonSlide;
}

export function SeasonScreen({ slide }: SeasonScreenProps) {
  if (slide.type === 'league-journey') {
    return <LeagueTableScreen title={slide.title} />;
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
      </div>
    </div>
  );
}
