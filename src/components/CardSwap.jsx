import React, { Children, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import './CardSwap.css';

export const Card = ({ children, className = '', ...rest }) => <div className={`card-swap-card${className ? ` ${className}` : ''}`} {...rest}>{children}</div>;

const CardSwap = forwardRef(function CardSwap({
  children,
  width = 420,
  height = 620,
  cardDistance = 0,
  verticalDistance = 24,
  depth = 100,
  skewAmount = 0,
  visibleCards = 4,
  delay = 4800,
  autoplay = true,
  pauseOnHover = true,
  draggable = true,
  speed = 1,
  bounce = 0.35,
  parallax = 0.45,
  hoverSpread = 0.12,
  dim = 0.5,
  cardRadius = 18,
  intro = true,
  onCardClick,
  onChange,
  className = ''
}, ref) {
  const cards = useMemo(() => Children.toArray(children), [children]);
  const [order, setOrder] = useState(() => cards.map((_, index) => index));
  const [hovered, setHovered] = useState(false);
  const [drag, setDrag] = useState({ active: false, x: 0, startX: 0 });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [activity, setActivity] = useState(0);
  const [exiting, setExiting] = useState(null);
  const root = useRef(null);
  const orderState = useRef(order);
  const exitTimer = useRef(null);
  const settleTimer = useRef(null);
  const dragState = useRef({ active: false, x: 0, startX: 0, pointerId: null });
  const exitingState = useRef(null);
  const queuedStep = useRef(null);
  const suppressClick = useRef(false);

  useEffect(() => () => {
    window.clearTimeout(exitTimer.current);
    window.clearTimeout(settleTimer.current);
  }, []);

  useEffect(() => {
    const next = cards.map((_, index) => index);
    orderState.current = next;
    setOrder(next);
  }, [cards.length]);
  useEffect(() => { orderState.current = order; }, [order]);
  useEffect(() => {
    if (order.length) onChange?.(order[0]);
  }, [onChange, order]);

  const move = direction => {
    setOrder(current => {
      if (current.length < 2) return current;
      const next = direction > 0
        ? [...current.slice(1), current[0]]
        : [current[current.length - 1], ...current.slice(0, -1)];
      orderState.current = next;
      return next;
    });
  };

  const step = (direction, exitDirection = direction) => {
    if (orderState.current.length < 2) return;
    if (exitingState.current) {
      queuedStep.current = { direction, exitDirection };
      return;
    }
    setActivity(value => value + 1);
    const exit = { index: orderState.current[0], direction: exitDirection };
    exitingState.current = exit;
    setExiting(exit);
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      move(direction);
      settleTimer.current = window.setTimeout(() => {
        exitingState.current = null;
        setExiting(null);
        const queued = queuedStep.current;
        queuedStep.current = null;
        if (queued) window.setTimeout(() => step(queued.direction, queued.exitDirection), 0);
      }, 70);
    }, 340);
  };

  const startDrag = event => {
    if (!draggable || event.button !== 0 || event.target.closest?.('button,input')) return;
    event.preventDefault();
    root.current?.setPointerCapture?.(event.pointerId);
    dragState.current = { active: true, x: 0, startX: event.clientX, pointerId: event.pointerId };
    setDrag({ active: true, x: 0, startX: event.clientX });
  };

  const updateDrag = event => {
    const current = dragState.current;
    if (!current.active || current.pointerId !== event.pointerId) return;
    const x = event.clientX - current.startX;
    dragState.current = { ...current, x };
    setDrag({ active: true, x, startX: current.startX });
  };

  const finishDrag = event => {
    const current = dragState.current;
    if (!current.active || current.pointerId !== event.pointerId) return;
    root.current?.releasePointerCapture?.(event.pointerId);
    if (Math.abs(current.x) > 42) step(1, current.x < 0 ? -1 : 1);
    if (Math.abs(current.x) > 6) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 0);
    }
    dragState.current = { active: false, x: 0, startX: 0, pointerId: null };
    setDrag({ active: false, x: 0, startX: 0 });
  };

  const cancelDrag = event => {
    const current = dragState.current;
    if (current.pointerId !== event.pointerId) return;
    dragState.current = { active: false, x: 0, startX: 0, pointerId: null };
    setDrag({ active: false, x: 0, startX: 0 });
  };

  useImperativeHandle(ref, () => ({ next: () => step(1), prev: () => step(-1) }));

  useEffect(() => {
    if (!autoplay || mediaPlaying || (pauseOnHover && hovered) || cards.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), Math.max(1800, delay));
    return () => window.clearInterval(timer);
  }, [activity, autoplay, cards.length, delay, hovered, mediaPlaying, pauseOnHover]);

  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    const sync = () => setMediaPlaying([...node.querySelectorAll('video')].some(video => !video.paused));
    node.addEventListener('play', sync, true);
    node.addEventListener('pause', sync, true);
    node.addEventListener('ended', sync, true);
    return () => {
      node.removeEventListener('play', sync, true);
      node.removeEventListener('pause', sync, true);
      node.removeEventListener('ended', sync, true);
    };
  }, []);

  const bringForward = index => {
    setActivity(value => value + 1);
    setOrder(current => {
      const position = current.indexOf(index);
      if (position <= 0) return current;
      const next = [...current.slice(position), ...current.slice(0, position)];
      orderState.current = next;
      return next;
    });
  };

  return <div
    ref={root}
    className={`card-swap${className ? ` ${className}` : ''}`}
    style={{ '--swap-w': `${width}px`, '--swap-h': `${height}px`, '--swap-radius': `${cardRadius}px`, '--swap-speed': `${.72 / Math.max(.1, speed)}s`, '--swap-ease-y': .82 + Math.min(1, Math.max(0, bounce)) * .32 }}
    data-intro={intro ? '' : undefined}
    data-dragging={drag.active ? '' : undefined}
    tabIndex={0}
    aria-label="视频卡片轮播"
    onKeyDown={event => { if (event.key === 'ArrowRight') step(1); if (event.key === 'ArrowLeft') step(-1); }}
    onPointerEnter={() => setHovered(true)}
    onPointerLeave={() => { setHovered(false); setPointer({ x: 0, y: 0 }); if (!drag.active) setDrag({ active: false, x: 0, startX: 0 }); }}
    onPointerDown={startDrag}
    onPointerMove={event => {
      const rect = root.current?.getBoundingClientRect();
      if (rect) setPointer({ x: (event.clientX - rect.left) / rect.width - .5, y: (event.clientY - rect.top) / rect.height - .5 });
      updateDrag(event);
    }}
    onPointerUp={finishDrag}
    onPointerCancel={cancelDrag}
  >
    <div className="card-swap-stage">
      {order.map((index, position) => {
        const visible = position < Math.min(visibleCards, cards.length);
        const spread = hovered ? 1 + hoverSpread : 1;
        const scale = 1 - position * depth / 1000;
        const x = position * cardDistance * spread + pointer.x * parallax * (position + 1) * 9;
        const y = position * verticalDistance * spread + pointer.y * parallax * (position + 1) * 7;
        const frontDrag = position === 0 ? drag.x : 0;
        const skew = position * skewAmount;
        const isExiting = exiting?.index === index;
        const exitX = isExiting ? exiting.direction * width * 1.35 : 0;
        return <div
          className={`card-swap-slot${position === 0 ? ' is-front' : ''}${isExiting ? ' is-exiting' : ''}`}
          key={index}
          style={{
            zIndex: cards.length - position,
            opacity: isExiting ? 0 : visible ? 1 - position * dim * .13 : 0,
            pointerEvents: visible ? 'auto' : 'none',
            transform: `translate3d(calc(-50% + ${x + frontDrag + exitX}px),calc(-50% + ${y}px),${-position * depth}px) scale(${scale}) rotate(${skew + frontDrag * .018 + (isExiting ? exiting.direction * 8 : 0)}deg)`
          }}
          onClick={() => {
            if (suppressClick.current) return;
            onCardClick?.(index);
            if (position > 0) bringForward(index);
          }}
        >{cards[index]}</div>;
      })}
    </div>
    <div className="card-swap-progress" aria-hidden="true">{order.map((index, position) => <i className={position === 0 ? 'is-active' : ''} key={index}/>)}</div>
  </div>;
});

export default CardSwap;
