import { useState } from 'react'
import { ChatTeardropDots } from 'phosphor-react'
export function Widget() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  function toggleWidgetVisibility() {
    setIsWidgetOpen(!isWidgetOpen)
  }
  return (
    <div className="absolute bottom-5 right-5">
      {isWidgetOpen && <p>Widget ok</p>}

      <button
        onClick={toggleWidgetVisibility}
        className="bg-brand-500 rounded-full px-3 h-12 text-white flex items-center group"
      >
        {/* create a group */}
        <ChatTeardropDots className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
          {/* on hover increase width */}
          {/* any element that overflows the max-width will be hidden */}
          <span className="pl-2"></span>
          Feedback
        </span>
      </button>
    </div>
  )
}
