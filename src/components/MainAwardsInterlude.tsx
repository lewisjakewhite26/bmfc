interface MainAwardsInterludeProps {
  title: string;
  season: string;
}

export function MainAwardsInterlude({ title, season }: MainAwardsInterludeProps) {
  return (
    <div className="screen-container main-awards-interlude fade-in-out">
      <div className="main-awards-interlude__inner">
        <div className="crest-wrap">
          <div className="crest-halo" />
          <img className="crest-img" src="/crest.png" alt="Bishop Middleham FC Crest" />
        </div>
        <h2 className="main-awards-interlude__title">{title}</h2>
        <p className="main-awards-interlude__season">{season}</p>
      </div>
    </div>
  );
}
