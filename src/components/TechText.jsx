import React, { useEffect, useRef, useState } from 'react';
import './TechText.css';

export default function TechText({
  text = 'React Bits',
  color = '#f5f5f0',
  accentColor = '#f5f5f0',
  strokeWidth = 1.35,
  specks = 8,
  selection = true,
  sweep = true,
  speed = 1,
  accentText = [],
  className = '',
  style
}) {
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const rootRef = useRef(null);
  const intersecting = useRef(false);
  const hovering = useRef(false);
  const lines = String(text).split('\n');
  const plainText = lines.join('');
  const chars = Array.from(plainText);
  const accents = Array.isArray(accentText) ? accentText : [accentText];
  const accentIndexes = new Set();
  accents.filter(Boolean).forEach(value => {
    let from = 0;
    let match = plainText.indexOf(value, from);
    while (match !== -1) {
      for (let i = match; i < match + Array.from(value).length; i += 1) accentIndexes.add(i);
      from = match + value.length;
      match = plainText.indexOf(value, from);
    }
  });

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const sync = () => setRunning(intersecting.current && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting.current = entry.isIntersecting;
      sync();
    }, { rootMargin: '120px 0px' });
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    if (!sweep || !running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let index = -1;
    const timer = window.setInterval(() => {
      if (hovering.current) return;
      index = (index + 1) % chars.length;
      setActive(index);
    }, Math.max(220, 720 / Math.max(.2, speed)));
    return () => window.clearInterval(timer);
  }, [chars.length, running, speed, sweep]);

  const onPointerMove = event => {
    hovering.current = true;
    const target = event.target;
    const glyph = target instanceof Element
      ? target.closest('[data-tech-index]')
      : null;
    if (glyph) setActive(Number(glyph.dataset.techIndex));
  };

  const onPointerLeave = () => {
    hovering.current = false;
  };

  return <span
    ref={rootRef}
    className={`tech-text ${className}`.trim()}
    style={{ '--tech-color': color, '--tech-accent': accentColor, '--tech-stroke': `${strokeWidth}px`, ...style }}
    role="img"
    aria-label={text}
    onPointerMove={onPointerMove}
    onPointerLeave={onPointerLeave}
  >
    {lines.map((line, lineIndex) => {
      const offset = lines.slice(0, lineIndex).reduce((total, value) => total + Array.from(value).length, 0);
      return <span className="tech-text__line" key={`${line}-${lineIndex}`}>
        {Array.from(line).map((char, charIndex) => {
          const index = offset + charIndex;
          return <span
            className={`tech-text__glyph${active === index ? ' is-active' : ''}${accentIndexes.has(index) ? ' is-accent' : ''}`}
            data-tech-index={index}
            key={`${char}-${index}`}
            aria-hidden="true"
          >
            <span className="tech-text__ink">{char === ' ' ? '\u00a0' : char}</span>
            {selection && active === index && <span className="tech-text__frame"/>}
            {active === index && specks > 0 && <span className="tech-text__specks">
              {Array.from({ length: Math.min(8, specks) }, (_, i) => <i key={i}/>) }
            </span>}
          </span>;
        })}
      </span>;
    })}
  </span>;
}
