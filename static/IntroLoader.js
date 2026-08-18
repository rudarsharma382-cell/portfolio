import React, { useState, useEffect } from 'react';

/**
 * IntroLoader - React component optimized for a DAG node structure.
 * Written using pure React.createElement to run natively in the browser without JSX transpilation.
 */
export default function IntroLoader({ onComplete }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Node A: Initial State -> Component Mount
    // Store original body overflow and block scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Node B -> Node C transition:
    // SVG stroke animation is 2.5s long. At 2.5s, trigger fade out unless debugging.
    const urlParams = new URLSearchParams(window.location.search);
    const debugLoader = urlParams.get('debug-loader') === 'true';

    let fadeTimer, completeTimer;
    if (!debugLoader) {
      fadeTimer = setTimeout(() => {
        setIsFading(true); // Node C: Fade Out Transition
      }, 2500);

      // Node C -> Node D transition:
      // Fade out duration is 500ms (0.5s). At 3.0s total, execute onComplete.
      completeTimer = setTimeout(() => {
        if (onComplete) {
          onComplete(); // Node D: Unmount Hook
        }
      }, 3000);
    }

    // Cleanup: restore overflow to body on component unmount
    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
      if (completeTimer) clearTimeout(completeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
    
    @keyframes drawName {
      0% {
        stroke-dashoffset: 800;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    
    @keyframes fillName {
      0% {
        fill: rgba(255, 255, 255, 0);
        stroke: #ffffff;
      }
      100% {
        fill: #ffffff;
        stroke: rgba(255, 255, 255, 0);
      }
    }
    
    .intro-text-signature {
      font-family: 'Great Vibes', cursive;
      font-size: 64px;
      font-weight: 400;
      fill: rgba(255, 255, 255, 0);
      stroke: #ffffff;
      stroke-width: 1.5;
      stroke-dasharray: 800;
      stroke-dashoffset: 800;
      animation: 
        drawName 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards,
        fillName 0.5s ease-in-out 2.0s forwards;
    }
  `;

  return React.createElement(
    'div',
    {
      id: 'intro-loader',
      className: `fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d0d0d] transition-opacity duration-500 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`
    },
    React.createElement(
      'div',
      { className: 'w-full max-w-xl px-6' },
      React.createElement(
        'svg',
        {
          viewBox: '0 0 500 100',
          className: 'w-full h-auto select-none',
          xmlns: 'http://www.w3.org/2000/svg'
        },
        React.createElement(
          'defs',
          null,
          React.createElement('style', null, cssStyles)
        ),
        React.createElement(
          'text',
          {
            x: '250',
            y: '60',
            textAnchor: 'middle',
            className: 'intro-text-signature'
          },
          'Rudar Sharma'
        )
      )
    )
  );
}
