import type { WidgetPosition } from '../types';

interface DropZonesProps {
  isVisible: boolean;
  currentPosition: WidgetPosition;
  hoverPosition: WidgetPosition | null;
}

const positions: WidgetPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const getPositionStyles = (position: WidgetPosition): React.CSSProperties => {
  // Fixed size for drop zones (smaller, not half screen)
  const size = 140;
  const offset = 24; // distance from corner
  
  switch (position) {
    case 'top-left':
      return { top: offset, left: offset, width: size, height: size };
    case 'top-right':
      return { top: offset, right: offset, width: size, height: size };
    case 'bottom-left':
      return { bottom: offset, left: offset, width: size, height: size };
    case 'bottom-right':
      return { bottom: offset, right: offset, width: size, height: size };
    default:
      return {};
  }
};

const getPositionLabel = (position: WidgetPosition): string => {
  switch (position) {
    case 'top-left':
      return '↖';
    case 'top-right':
      return '↗';
    case 'bottom-left':
      return '↙';
    case 'bottom-right':
      return '↘';
    default:
      return '';
  }
};

export default function DropZones({ isVisible, currentPosition, hoverPosition }: DropZonesProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/10 transition-opacity duration-200" />
      
      {/* Drop zones - smaller fixed size, positioned in corners */}
      {positions.map((pos) => {
        const isCurrent = pos === currentPosition;
        const isHovered = pos === hoverPosition;
        const isAvailable = !isCurrent;
        
        return (
          <div
            key={pos}
            className={`
              absolute flex items-center justify-center
              transition-all duration-200 ease-out
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
            style={getPositionStyles(pos)}
          >
            {/* Zone background - smaller rounded box */}
            <div
              className={`
                relative w-full h-full rounded-2xl
                flex flex-col items-center justify-center
                border-3 border-dashed
                transition-all duration-300
                ${isHovered 
                  ? 'bg-purple-500/40 border-purple-500 shadow-2xl shadow-purple-500/40' 
                  : isAvailable
                    ? 'bg-purple-500/15 border-purple-400/60 animate-pulse'
                    : 'bg-gray-400/15 border-gray-400/40'
                }
              `}
            >
              {/* Icon / Arrow */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-xl font-bold
                  transition-all duration-200
                  ${isHovered 
                    ? 'bg-purple-500 text-white scale-110' 
                    : isAvailable
                      ? 'bg-purple-400/40 text-purple-700'
                      : 'bg-gray-400/30 text-gray-500'
                  }
                `}
              >
                {isCurrent ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{getPositionLabel(pos)}</span>
                )}
              </div>
              
              {/* Label text - smaller */}
              <span
                className={`
                  mt-1 text-xs font-medium px-2 py-0.5 rounded-full
                  transition-all duration-200
                  ${isHovered 
                    ? 'bg-purple-500 text-white' 
                    : isAvailable
                      ? 'bg-purple-400/20 text-purple-700'
                      : 'bg-gray-400/20 text-gray-500'
                  }
                `}
              >
                {isCurrent ? 'Here' : pos.replace('-', ' ')}
              </span>
              
              {/* Pulsing ring effect for available zones */}
              {isAvailable && !isHovered && (
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/40 animate-ping" />
              )}
              
              {/* Glow effect for hovered zone */}
              {isHovered && (
                <div className="absolute inset-0 rounded-2xl bg-purple-500/30 blur-lg" />
              )}
            </div>
          </div>
        );
      })}
      
      {/* Instruction text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg">
        <p className="text-purple-700 font-medium text-sm flex items-center gap-2">
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          Drop in a highlighted area
        </p>
      </div>
    </div>
  );
}
