import type { PresentationFlow } from '../config/presentationFlow';

interface ModePickerScreenProps {
  onSelect: (flow: PresentationFlow) => void;
}

export function ModePickerScreen({ onSelect }: ModePickerScreenProps) {
  return (
    <div className="screen-container mode-picker-screen">
      <div className="mode-picker-screen__inner">
        <p className="mode-picker-screen__label">Choose presentation order</p>
        <p className="mode-picker-screen__fullscreen-hint">Press F for fullscreen</p>
        <div className="mode-picker-cards">
          <button
            type="button"
            className="mode-picker-card"
            onClick={() => onSelect('jokes-first')}
          >
            <span className="mode-picker-card__title">Funny First</span>
            <span className="mode-picker-card__hint">Joke awards, then main awards</span>
          </button>
          <button
            type="button"
            className="mode-picker-card"
            onClick={() => onSelect('serious-first')}
          >
            <span className="mode-picker-card__title">Serious First</span>
            <span className="mode-picker-card__hint">Main awards, then joke awards</span>
          </button>
        </div>
      </div>
    </div>
  );
}
