"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial position to bottom right corner
    if (typeof window !== "undefined") {
      setPosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100,
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (bubbleRef.current) {
      const rect = bubbleRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      startPosRef.current = { x: e.clientX, y: e.clientY };
      setHasMoved(false);
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = Math.abs(e.clientX - startPosRef.current.x);
        const deltaY = Math.abs(e.clientY - startPosRef.current.y);
        
        // If moved more than 5px, consider it a drag
        if (deltaX > 5 || deltaY > 5) {
          setHasMoved(true);
        }

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep bubble within viewport
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Reset after a short delay to allow click handler to check hasMoved
      setTimeout(() => {
        setHasMoved(false);
      }, 100);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleBubbleClick = (e: React.MouseEvent) => {
    // Only toggle if not dragging and didn't move (was a click, not drag)
    if (!isDragging && !hasMoved) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <div
        ref={bubbleRef}
        className="fixed z-50 cursor-move"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleBubbleClick}
      >
        <div
          className={`w-14 h-14 rounded-full bg-blue-600 shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-2xl"
          style={{
            left: typeof window !== "undefined" 
              ? `${Math.min(position.x, window.innerWidth - 340)}px`
              : `${position.x}px`,
            top: typeof window !== "undefined"
              ? `${Math.max(20, position.y - 280)}px`
              : `${position.y - 280}px`,
            width: "320px",
            maxHeight: "400px",
          }}
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4">
            <div className="mb-4">
              <div className="bg-gray-100 rounded-lg p-3 inline-block max-w-full">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Cảm ơn bạn đã quan tâm KS, cần hỗ trợ liên hệ thì zalo qua{" "}
                  <a
                    href="https://zalo.me/0787206699"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    0787206699
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

