interface TransitionScreenProps {
  title: string;
  lines: string[];
}

export function TransitionScreen({ title, lines }: TransitionScreenProps) {
  return (
    <div className="screen-container season-screen fade-in-out">
      <div className="season-slide-wrap">
        <h2 className="award-category award-category--compact">{title}</h2>
        <ul className="season-highlights season-section-intro">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
