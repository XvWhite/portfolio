import React, { useEffect, useRef, useState } from 'react';
import './PortfolioVideoPlayer.css';

const formatTime = value => {
  if (!Number.isFinite(value) || value < 0) return '00:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function PortfolioVideoPlayer({
  src,
  poster,
  title,
  active = true,
  autoPlay = false,
  preload = 'metadata',
  className = '',
  onPlay,
  onPause,
}) {
  const root = useRef(null);
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (!active || !src) {
      node.pause();
      node.removeAttribute('src');
      node.load();
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);
      return;
    }
    setError(false);
    node.load();
    if (autoPlay) node.play().catch(() => setPlaying(false));
  }, [active, autoPlay, retryKey, src]);

  const syncTimeline = event => {
    const node = event.currentTarget;
    const nextDuration = Number.isFinite(node.duration) ? node.duration : 0;
    setDuration(nextDuration);
    setCurrentTime(node.currentTime || 0);
    if (node.buffered.length && nextDuration) {
      setBuffered(Math.min(1, node.buffered.end(node.buffered.length - 1) / nextDuration));
    }
  };

  const togglePlay = () => {
    const node = video.current;
    if (!node || !src) return;
    if (node.paused) node.play().catch(() => setError(true));
    else node.pause();
  };

  const seek = event => {
    const node = video.current;
    const next = Number(event.target.value);
    if (!node || !Number.isFinite(next)) return;
    node.currentTime = next;
    setCurrentTime(next);
  };

  const changeVolume = event => {
    const node = video.current;
    const next = Number(event.target.value);
    if (!node || !Number.isFinite(next)) return;
    node.volume = next;
    node.muted = next === 0;
    setVolume(next);
    setMuted(next === 0);
  };

  const toggleMute = () => {
    const node = video.current;
    if (!node) return;
    node.muted = !node.muted;
    setMuted(node.muted);
  };

  const enterFullscreen = async () => {
    const container = root.current;
    const node = video.current;
    try {
      if (container?.requestFullscreen) await container.requestFullscreen();
      else if (container?.webkitRequestFullscreen) container.webkitRequestFullscreen();
      else if (node?.webkitEnterFullscreen) node.webkitEnterFullscreen();
    } catch {
      node?.webkitEnterFullscreen?.();
    }
  };

  const stopControlGesture = event => event.stopPropagation();
  const progress = duration ? Math.min(1, currentTime / duration) : 0;

  return <div ref={root} className={`portfolio-video-player${playing ? ' is-playing' : ''}${loading ? ' is-loading' : ''}${error ? ' has-error' : ''}${className ? ` ${className}` : ''}`}>
    <video
      key={retryKey}
      ref={video}
      src={active ? src : undefined}
      poster={poster}
      preload={active ? preload : 'none'}
      playsInline
      aria-label={`${title} 视频`}
      onLoadStart={() => active && setLoading(true)}
      onCanPlay={() => setLoading(false)}
      onLoadedMetadata={syncTimeline}
      onDurationChange={syncTimeline}
      onTimeUpdate={syncTimeline}
      onProgress={syncTimeline}
      onWaiting={() => setLoading(true)}
      onPlaying={event => { setLoading(false); setPlaying(true); onPlay?.(event); }}
      onPause={event => { setPlaying(false); onPause?.(event); }}
      onEnded={event => { setPlaying(false); onPause?.(event); }}
      onVolumeChange={event => { setVolume(event.currentTarget.volume); setMuted(event.currentTarget.muted); }}
      onError={() => active && src && (setError(true), setLoading(false))}
    />

    {!playing && !error && <button className="portfolio-video-player__center-play" type="button" onClick={togglePlay} onPointerDown={stopControlGesture} data-video-control aria-label={`播放 ${title}`}>▶</button>}
    {loading && !error && <span className="portfolio-video-player__loading" aria-hidden="true" />}

    {error && <div className="portfolio-video-player__error" data-video-control onPointerDown={stopControlGesture}>
      <strong>视频暂时无法加载</strong>
      <button type="button" onClick={() => setRetryKey(value => value + 1)}>重新加载</button>
    </div>}

    <div className="portfolio-video-player__controls" data-video-control onPointerDown={stopControlGesture} onPointerMove={stopControlGesture} onPointerUp={stopControlGesture} onClick={stopControlGesture}>
      <div className="portfolio-video-player__timeline" style={{ '--video-progress': progress, '--video-buffered': buffered }}>
        <span className="portfolio-video-player__buffer" aria-hidden="true" />
        <span className="portfolio-video-player__played" aria-hidden="true" />
        <input type="range" min="0" max={duration || 0} step="0.01" value={Math.min(currentTime, duration || 0)} onChange={seek} aria-label="视频进度" />
      </div>
      <div className="portfolio-video-player__control-row">
        <button type="button" onClick={togglePlay} aria-label={playing ? `暂停 ${title}` : `播放 ${title}`}>{playing ? 'Ⅱ' : '▶'}</button>
        <span className="portfolio-video-player__time">{formatTime(currentTime)} / {formatTime(duration)}</span>
        <div className="portfolio-video-player__volume">
          <button type="button" onClick={toggleMute} aria-label={muted ? '取消静音' : '静音'}>{muted || volume === 0 ? '静音' : '音量'}</button>
          <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={changeVolume} aria-label="音量" />
        </div>
        <button type="button" onClick={enterFullscreen} aria-label={`全屏播放 ${title}`}>全屏</button>
      </div>
    </div>
  </div>;
}
