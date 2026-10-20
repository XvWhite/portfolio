import React, { useEffect, useRef } from 'react';
import './FlipCard.css';

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

export default function FlipCard({
  front = null,
  onActivate,
  tilt = true,
  tiltMax = 12,
  hoverScale = 1.03,
  perspective = 1100,
  aspectRatio = '3 / 4',
  radius = 22,
  background = '#27272a',
  color = '#f5f5f5',
  shadow = true,
  shadowColor = '#000000',
  shadowOpacity = 0.45,
  disabled = false,
  ariaLabel = 'Flip card',
  className = '',
}) {
  const rootRef = useRef(null);
  const rotorRef = useRef(null);
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const paint = () => {
    frameRef.current = 0;
    const rotor = rotorRef.current;
    if (!rotor) return;
    const point = pointRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const active = point.active && tilt && !disabled && !reduce;
    const rotateX = active ? (0.5 - point.y) * 2 * tiltMax : 0;
    const rotateY = active ? (point.x - 0.5) * 2 * tiltMax : 0;
    const scale = active ? hoverScale : 1;
    rotor.style.transform = `perspective(${perspective}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const schedule = () => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
  };

  const locate = event => {
    if (!tilt || disabled || event.pointerType === 'touch') return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointRef.current = {
      x: clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1),
      y: clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1),
      active: true,
    };
    rootRef.current?.setAttribute('data-tilting', '');
    schedule();
  };

  const reset = () => {
    pointRef.current = { x: 0.5, y: 0.5, active: false };
    rootRef.current?.removeAttribute('data-tilting');
    schedule();
  };

  const activate = event => {
    if (!disabled) onActivate?.(event);
  };

  return <div
    ref={rootRef}
    role="button"
    tabIndex={disabled ? -1 : 0}
    aria-label={ariaLabel}
    aria-disabled={disabled || undefined}
    className={`flip-card${className ? ` ${className}` : ''}`}
    data-static=""
    data-disabled={disabled ? '' : undefined}
    onPointerEnter={locate}
    onPointerMove={locate}
    onPointerLeave={reset}
    onPointerCancel={reset}
    onClick={activate}
    onKeyDown={event => {
      if (disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      if (!event.repeat) activate(event);
    }}
    onDragStart={event => event.preventDefault()}
    style={{
      '--fc-aspect': aspectRatio,
      '--fc-radius': `${radius}px`,
      '--fc-bg': background,
      '--fc-ink': color,
      '--fc-shadow': shadowColor,
      '--fc-shadow-o': shadowOpacity,
    }}
  >
    <div ref={rotorRef} className="flip-card__rotor">
      {shadow && <span className="flip-card__shadow" aria-hidden="true" />}
      <div className="flip-card__face flip-card__face--front">{front}</div>
    </div>
  </div>;
}
