import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "AWARDS PRESENTATION · BISHOP MIDDLEHAM FC · 2025 / 26 · AWARDS NIGHT · ";
  
  return (
    <div className="marquee-container">
      {/* We repeat the text twice so it forms a continuous, seamless loop */}
      <div className="marquee-text">
        {marqueeText}
        {marqueeText}
      </div>
    </div>
  );
};
