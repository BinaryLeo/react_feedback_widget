import { useState, useRef, useCallback, useEffect } from 'react';
import type { WidgetPosition } from '../types';

type DragState = 'idle' | 'dragging' | 'dropped';

interface DraggableWidgetOptions {
  position: WidgetPosition;
  onPositionChange: (position: WidgetPosition) => void;
  isOpen: boolean;
}

interface DraggableWidgetReturn {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  dragState: DragState;
  currentPosition: WidgetPosition;
  isDragging: boolean;
  draggedPosition: { x: number; y: number } | null;
  hoverPosition: WidgetPosition | null;
  handleMouseDown: (e: React.MouseEvent) => void;
}

const getPositionFromCoordinates = (
  x: number, 
  y: number, 
  windowWidth: number, 
  windowHeight: number
): WidgetPosition => {
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  
  if (x < centerX && y < centerY) return 'top-left';
  if (x >= centerX && y < centerY) return 'top-right';
  if (x < centerX && y >= centerY) return 'bottom-left';
  return 'bottom-right';
};

const getPositionClasses = (position: WidgetPosition): string => {
  switch (position) {
    case 'bottom-right':
      return 'fixed bottom-6 right-6';
    case 'bottom-left':
      return 'fixed bottom-6 left-6';
    case 'top-right':
      return 'fixed top-3 right-6';
    case 'top-left':
      return 'fixed top-3 left-6';
    default:
      return 'fixed bottom-6 right-6';
  }
};

// Threshold in pixels to distinguish between click and drag
const DRAG_THRESHOLD = 8;

export function useDraggableWidget({ 
  position, 
  onPositionChange, 
  isOpen 
}: DraggableWidgetOptions): DraggableWidgetReturn {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dragState, setDragState] = useState<DragState>('idle');
  const [currentPosition, setCurrentPosition] = useState<WidgetPosition>(position);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPosition, setDraggedPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoverPosition, setHoverPosition] = useState<WidgetPosition | null>(null);
  
  // Track drag start position
  const dragStartPos = useRef({ x: 0, y: 0 });
  const mouseStartPos = useRef({ x: 0, y: 0 });
  const hasExceededThreshold = useRef(false);
  const isMouseDown = useRef(false);

  // Sync with external position prop
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  // Handle mouse down - start tracking
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isOpen) return;
    
    // Only left mouse button
    if (e.button !== 0) return;
    
    e.preventDefault();
    
    const button = buttonRef.current;
    if (!button) return;

    isMouseDown.current = true;
    
    // Get button position
    const rect = button.getBoundingClientRect();
    
    // Store positions relative to viewport
    dragStartPos.current = { 
      x: rect.left, 
      y: rect.top 
    };
    mouseStartPos.current = { 
      x: e.clientX, 
      y: e.clientY 
    };
    
    hasExceededThreshold.current = false;
  }, [isOpen]);

  // Handle global mouse move
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) return;
      
      const dx = Math.abs(e.clientX - mouseStartPos.current.x);
      const dy = Math.abs(e.clientY - mouseStartPos.current.y);
      
      // Check if we've exceeded the drag threshold
      if (!hasExceededThreshold.current && (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD)) {
        hasExceededThreshold.current = true;
        setIsDragging(true);
        setDragState('dragging');
      }
      
      // If dragging, update visual position
      if (hasExceededThreshold.current) {
        const offsetX = e.clientX - mouseStartPos.current.x;
        const offsetY = e.clientY - mouseStartPos.current.y;
        
        // Calculate new position but clamp to viewport
        let newX = dragStartPos.current.x + offsetX;
        let newY = dragStartPos.current.y + offsetY;
        
        // Clamp to viewport bounds (keep some margin)
        const margin = 20;
        newX = Math.max(margin, Math.min(window.innerWidth - 76 - margin, newX));
        newY = Math.max(margin, Math.min(window.innerHeight - 76 - margin, newY));
        
        setDraggedPosition({ x: newX, y: newY });
        
        // Calculate which position is being hovered
        const hoverPos = getPositionFromCoordinates(
          e.clientX,
          e.clientY,
          window.innerWidth,
          window.innerHeight
        );
        setHoverPosition(hoverPos);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (!isMouseDown.current) return;
      
      isMouseDown.current = false;
      
      if (hasExceededThreshold.current) {
        // This was a drag - calculate new position
        const newPosition = getPositionFromCoordinates(
          e.clientX,
          e.clientY,
          window.innerWidth,
          window.innerHeight
        );
        
        setCurrentPosition(newPosition);
        onPositionChange(newPosition);
        setDragState('dropped');
        
        // Clear visual position after animation
        setTimeout(() => {
          setDraggedPosition(null);
          setHoverPosition(null);
          setDragState('idle');
          setIsDragging(false);
        }, 200);
      } else {
        // This was a click - reset state
        setDragState('idle');
        setIsDragging(false);
      }
      
      hasExceededThreshold.current = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onPositionChange]);

  return {
    buttonRef,
    dragState,
    currentPosition,
    isDragging,
    draggedPosition,
    hoverPosition,
    handleMouseDown
  };
}

export { getPositionClasses, getPositionFromCoordinates };
export type { DragState };
