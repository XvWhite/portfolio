import React, { useEffect, useRef } from 'react';
import './SpotlightCard.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function SpotlightCard({ children, className = '', style, spotlightColor = 'rgba(205,229,193,1)', intensity = 0.14, spotlightSize = 260, borderGlow = 0.55, smoothing = 0.3, flare = true, ...rest }) {
  const rootRef = useRef(null);
  const frameRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0, opacity: 0, flare: 0 });
  const currentRef = useRef({ x: 0, y: 0, opacity: 0, flare: 0 });

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const paint = () => {
    frameRef.current = 0;
    const root = rootRef.current;
    if (!root) return;
    const target = targetRef.current;
    const current = currentRef.current;
    const follow = 1 - clamp(smoothing, 0, 1) * 0.72;
    current.x += (target.x - current.x) * follow;
    current.y += (target.y - current.y) * follow;
    current.opacity += (target.opacity - current.opacity) * 0.18;
    current.flare += (target.flare - current.flare) * 0.2;
    root.style.setProperty('--spot-x', `${current.x}px`);
    root.style.setProperty('--spot-y', `${current.y}px`);
    root.style.setProperty('--spot-opacity', String(current.opacity));
    root.style.setProperty('--spot-flare', String(current.flare));
    if (Math.abs(target.x-current.x)>.15 || Math.abs(target.y-current.y)>.15 || Math.abs(target.opacity-current.opacity)>.01 || Math.abs(target.flare-current.flare)>.01) frameRef.current=requestAnimationFrame(paint);
  };
  const wake = () => { if (!frameRef.current) frameRef.current = requestAnimationFrame(paint); };
  const locate = event => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetRef.current.x = event.clientX - rect.left;
    targetRef.current.y = event.clientY - rect.top;
    targetRef.current.opacity = 1;
    wake();
  };

  return <div ref={rootRef} className={`spotlight-card${className ? ` ${className}` : ''}`} style={{ '--spot-color':spotlightColor, '--spot-intensity':clamp(intensity,0,1), '--spot-size':`${Math.max(40,spotlightSize)}px`, '--spot-border-glow':clamp(borderGlow,0,1), ...style }} onPointerEnter={locate} onPointerMove={locate} onPointerLeave={()=>{targetRef.current.opacity=0;targetRef.current.flare=0;wake();}} onPointerDown={()=>{if(flare)targetRef.current.flare=1;wake();}} onPointerUp={()=>{targetRef.current.flare=0;wake();}} {...rest}>
    <span className="spotlight-card__light" aria-hidden="true"/>
    {children}
    <span className="spotlight-card__border" aria-hidden="true"/>
  </div>;
}
