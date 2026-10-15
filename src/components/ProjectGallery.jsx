import React, { useEffect, useRef, useState } from 'react';
import FlexCarousel from './FlexCarousel';
import CardSwap, { Card } from './CardSwap';
import PortfolioVideoPlayer from './PortfolioVideoPlayer';
import galleries from '../gallery-data.json';
import './ProjectGallery.css';

const mediaSrc = path => import.meta.env.DEV ? `/videos/${path}` : `/media/${path}`;

export const projectCover = project => {
  if (project.id === '01') return galleries.scene.find(item => item.source === '3.png').src;
  if (project.id === '02') return galleries.tear.find(item => item.source === 'nj (1).png').src;
  if (project.id === '03') return galleries.toposh.find(item => item.source === '珠宝2.jpg').src;
  if (project.id === '04') return '/images/project-covers/skills-ui.webp';
  if (project.id === '05') return '/images/project-covers/narrative-film.webp';
  return '/images/' + project.image;
};

const VIDEO_GROUPS = {
  '01': [
    { title: 'NJ 01', subtitle: 'NANA JACQUELINE / FASHION FILM', src: mediaSrc('nj/nj-01.mp4'), poster: '/images/video-posters/nj-01.jpg' },
    { title: 'NJ 02', subtitle: 'NANA JACQUELINE / FASHION FILM', src: mediaSrc('nj/nj-02.mp4'), poster: '/images/video-posters/nj-02.jpg' },
    { title: 'NJ 03', subtitle: 'NANA JACQUELINE / FASHION FILM', src: mediaSrc('nj/nj-03.mp4'), poster: '/images/video-posters/nj-03.jpg' },
    { title: 'NJ 04', subtitle: 'NANA JACQUELINE / FASHION FILM', src: mediaSrc('nj/nj-04.mp4'), poster: '/images/video-posters/nj-04.jpg' },
  ],
  '03': [
    { title: 'TOPOSH 01', subtitle: '品牌珠宝展示视频', src: mediaSrc('toposh/toposh-01.mp4'), poster: '/images/video-posters/toposh-01.jpg' },
    { title: 'TOPOSH 02', subtitle: '品牌珠宝展示视频', src: mediaSrc('toposh/toposh-02.mp4'), poster: '/images/video-posters/toposh-02.jpg' },
    { title: 'TOPOSH 03', subtitle: '社交平台投放视频', src: mediaSrc('toposh/toposh-03.mp4'), poster: '/images/video-posters/toposh-03.jpg' },
    { title: 'TOPOSH 04', subtitle: '社交平台投放视频', src: mediaSrc('toposh/toposh-04.mp4'), poster: '/images/video-posters/toposh-04.jpg' },
  ],
};

const VIDEO_GROUP_DETAILS = {
  '01': {
    eyebrow: 'NANA JACQUELINE / AI FASHION FILM',
    title: '品牌模特场景展示视频',
    lead: '为电商详情页、社交媒体与广告投放构建统一、完整的动态品牌形象。',
    description: '围绕品牌模特展示需求，固定系列人物的外貌、妆容与发型，高度还原服装和首饰的款式与材质，并细化人物皮肤质感与场景氛围，使最终画面达到商业广告级品质，同时保留 Nana Jacqueline 的品牌气质。',
    role: 'AI 视频生成',
    scope: ['人物一致性', '服装与首饰还原', '真实皮肤质感', '品牌氛围构建'],
  },
  '03': {
    eyebrow: 'TOPOSH / JEWELRY CAMPAIGN FILM',
    title: '品牌珠宝海外市场社媒投放视频',
    lead: '从品牌需求出发，将珠宝质感、视觉节奏与海外社媒传播场景组织成完整短片。',
    description: '依据品牌方需求细化视频脚本，完成分镜设计与视觉风格规划；使用 AIGC 工具生成视频素材，并负责后期剪辑、调色、音画合成及最终成片输出，保障宣发物料按时、按质交付。',
    role: '视频全流程',
    scope: ['脚本细化', '分镜设计', 'AIGC 素材生成', '剪辑与调色'],
  },
};

const VIDEO_DETAILS = {
  '04': {
    src: mediaSrc('skills-ui/skills-ui.mp4'),
    poster: '/images/project-covers/skills-ui.webp',
    eyebrow: 'PRODUCT FILM / AI VIDEO',
    title: 'Skills UI 产品商业化宣传视频',
    lead: '以 UI 实操演示与 AI 实景小剧场交替展开，让产品功能与真实使用场景在同一条叙事线中被看见。',
    description: '基于甲方提供的简易创意大纲，独立完成叙事重构、脚本深化、分镜设计、AI 实景素材制作与动态 UI 演示，并负责剪辑、配乐、字幕包装和调色等全套后期工作。',
    role: 'AI 视频主创',
    scope: ['脚本深化', 'AE 动态 UI', 'AI 实景创作', '剪辑与调色'],
  },
  stranger: {
    src: mediaSrc('story/familiar-stranger.mp4'),
    poster: '/images/project-covers/narrative-film.webp',
    eyebrow: 'AI NARRATIVE FILM / PERSONAL PROJECT',
    title: '最熟悉的陌生人',
    lead: '不知道从哪天开始，我的生活中出现了一个陌生的男人。我不知道他是谁，直到……',
    description: '全流程 AI 剧情短片。从剧本编写、分镜设计、资产制作到视频生成与剪辑后期，由个人独立完成。',
    role: '全流程个人创作',
    scope: ['剧本编写', '分镜设计', '资产制作', '视频生成', '剪辑后期'],
  },
  museum: {
    src: mediaSrc('story/museum-night.mp4'),
    poster: '/images/project-covers/narrative-film.webp',
    eyebrow: 'AI NARRATIVE FILM / TV PROJECT',
    title: '博物馆奇妙夜',
    lead: '中秋之夜，一束月光照进非遗博物馆，今晚是个狂欢夜。',
    description: '青岛电视台中秋 AI 晚会节目片段，主要负责视频生成和素材制作；当前展示内容为重新剪辑版本。',
    role: 'AI 视频生成与素材制作',
    scope: ['非遗主题', '视频生成', '素材制作', '重新剪辑'],
  },
};

const GALLERY_DETAILS = {
  '01-scene': {
    eyebrow: 'SCENE PORTRAITS / ART DIRECTION',
    description: '围绕高端珠宝广告氛围，构建光影棚拍、都市街景与自然外景等品牌场景；统一人物外貌、妆容与发型，并准确还原服装和首饰材质。',
  },
  '01-looks': {
    eyebrow: 'FULL LOOKS / E-COMMERCE VISUALS',
    description: '面向电商详情页制作服装上身与模特全身展示，保持系列人物与造型一致，在清晰呈现版型、材质和穿着效果的同时维持商业广告质感。',
  },
  '02-main': {
    eyebrow: 'TEAR DROP / JEWELRY CAMPAIGN',
    description: '以水滴与花朵为核心视觉元素，将珠宝的精致质感与自然意象融为一体，形成兼具艺术表达与商业传播力的系列海报。',
  },
  '03-posters': {
    eyebrow: 'TOPOSH / GLOBAL CAMPAIGN VISUALS',
    description: '围绕品牌珠宝海外市场传播，强化金属质感、宝石火彩与材质细节，并结合不同系列的设计语言，输出具有品牌辨识度的商业海报。',
  },
};

const initialGroup = id => id === '05' ? 'stranger' : id === '03' ? 'posters' : id === '01' ? 'scene' : 'main';

function VideoGrid({ project, onPlay, onPause }) {
  return <div className="video-grid" key={`${project.id}-videos`}>
    {VIDEO_GROUPS[project.id].map((video, index) => <article className="video-tile" key={video.title}>
      <PortfolioVideoPlayer {...video} preload="none" onPlay={onPlay} onPause={onPause} />
    </article>)}
  </div>;
}

function VideoSwapFeature({ project, onPlay, onPause }) {
  const videos = VIDEO_GROUPS[project.id];
  const detail = VIDEO_GROUP_DETAILS[project.id];
  const [activeVideo, setActiveVideo] = useState(0);

  return <div className="video-swap-feature" key={`${project.id}-video-swap`}>
    <div className="video-swap-feature__deck">
      <CardSwap width={370} height={620} cardDistance={52} verticalDistance={6} depth={75} skewAmount={0} visibleCards={4} autoplay={false} pauseOnHover draggable speed={1} bounce={.5} parallax={.55} hoverSpread={.12} dim={.9} cardRadius={17} onChange={setActiveVideo}>
        {videos.map((video, index) => <Card key={video.title} className="video-swap-card">
          <PortfolioVideoPlayer {...video} active={index === activeVideo} autoPlay={index === activeVideo} preload={index === activeVideo ? 'metadata' : 'none'} onPlay={onPlay} onPause={onPause} />
        </Card>)}
      </CardSwap>
    </div>
    <article className="video-feature__copy video-swap-feature__copy">
      <span className="video-feature__eyebrow">{detail.eyebrow}</span>
      <div className="video-swap-feature__counter"><span>VIDEO</span><strong>{String(activeVideo + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</strong></div>
      <h3>{detail.title}</h3>
      <p className="video-feature__lead">{detail.lead}</p>
      <p className="video-feature__description">{detail.description}</p>
      <div className="video-feature__meta"><span>ROLE</span><strong>{detail.role}</strong></div>
      <div className="video-feature__scope">{detail.scope.map(item => <span key={item}>{item}</span>)}</div>
      <p className="video-swap-feature__gesture-hint">左右拖动切换视频 · 上下滑动浏览项目介绍</p>
    </article>
  </div>;
}

function VideoFeature({ detail, onPlay, onPause }) {
  return <div className="video-feature" key={detail.title}>
    <div className="video-feature__media"><PortfolioVideoPlayer title={detail.title} src={detail.src} poster={detail.poster} onPlay={onPlay} onPause={onPause} /></div>
    <article className="video-feature__copy">
      <span className="video-feature__eyebrow">{detail.eyebrow}</span>
      <h3>{detail.title}</h3>
      <p className="video-feature__lead">{detail.lead}</p>
      <p className="video-feature__description">{detail.description}</p>
      <div className="video-feature__meta"><span>ROLE</span><strong>{detail.role}</strong></div>
      <div className="video-feature__scope">{detail.scope.map(item => <span key={item}>{item}</span>)}</div>
    </article>
  </div>;
}

export default function ProjectGallery({ project, onClose }) {
  const dialog = useRef(null);
  const stage = useRef(null);
  const closeTimer = useRef(null);
  const [group, setGroup] = useState(initialGroup(project.id));
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(null);
  const [closing, setClosing] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const isImageGallery = project.id === '02' || (project.id === '01' && group !== 'videos') || (project.id === '03' && group === 'posters');
  const items = project.id === '01' && group !== 'videos' ? galleries[group]
    : project.id === '02' ? galleries.tear
    : project.id === '03' && group === 'posters' ? galleries.toposh
    : [];
  const selected = items[current] || items[0];
  const detail = project.id === '04' ? VIDEO_DETAILS['04'] : project.id === '05' ? VIDEO_DETAILS[group] : null;
  const galleryDetail = GALLERY_DETAILS[`${project.id}-${group}`];

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    requestAnimationFrame(() => stage.current?.querySelector('.flex-carousel')?.focus());
    return () => {
      clearTimeout(closeTimer.current);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  function requestClose() {
    if (closing) return;
    setClosing(true);
    stage.current?.querySelectorAll('video').forEach(video => video.pause());
    closeTimer.current = setTimeout(onClose, 280);
  }

  function changeGroup(next) {
    if (next === group) return;
    setGroup(next);
    setCurrent(0);
    setZoomed(null);
    setVideoPlaying(false);
  }

  function handleVideoPlay(event) {
    stage.current?.querySelectorAll('video').forEach(video => { if (video !== event.currentTarget) video.pause(); });
    setVideoPlaying(true);
  }

  function handleVideoPause() {
    const videos = [...(stage.current?.querySelectorAll('video') || [])];
    if (!videos.some(video => !video.paused)) setVideoPlaying(false);
  }

  function navigate(key) {
    const carousel = stage.current?.querySelector('.flex-carousel');
    carousel?.focus();
    carousel?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  }

  const tabs = project.id === '01'
    ? [['scene', '模特场景图', galleries.scene.length], ['looks', '模特全身图', galleries.looks.length], ['videos', '视频', 4]]
    : project.id === '03'
      ? [['posters', '品牌海报', galleries.toposh.length], ['videos', '视频', 4]]
      : project.id === '05'
        ? [['stranger', '最熟悉的陌生人'], ['museum', '博物馆奇妙夜']]
        : [];

  return <dialog ref={dialog} className="project-gallery" data-closing={closing ? '' : undefined} data-video-playing={videoPlaying ? '' : undefined} aria-label={`${project.title} 作品详情`} onCancel={event => { event.preventDefault(); if (zoomed) setZoomed(null); else requestClose(); }}>
    <div className={`gallery-ambience${selected ? '' : ' gallery-ambience--video'}`} aria-hidden="true" style={selected ? { backgroundImage: `url("${selected.src}")` } : undefined} />
    <div className="gallery-shade" aria-hidden="true" />
    <header className="gallery-header">
      <div className="gallery-heading"><span>SELECTED WORK</span><h2>{project.title}</h2></div>
      {tabs.length > 0 && <nav className="gallery-tabs" aria-label={`${project.title} 作品目录`}>
        {tabs.map(([id, label, count]) => <button key={id} aria-pressed={group === id} onClick={() => changeGroup(id)}>{label}{count && <sup>{count}</sup>}</button>)}
      </nav>}
      <button className="gallery-close" onClick={requestClose} aria-label="关闭作品详情">关闭 <span>×</span></button>
    </header>

    <div className={`gallery-stage${isImageGallery ? '' : ' gallery-stage--video'}`} ref={stage}>
      {isImageGallery && <FlexCarousel key={group} items={items} preset="ribbon" intro="deal" fit="natural" cardHeight={0.70} gap={28} squeeze={0} bend={0.12} dispersion={0.08} focusOnClick={false} captions={false} onChange={index => setCurrent(index)} onSelect={(_, item) => setZoomed(item)} />}
      {!isImageGallery && (project.id === '01' || project.id === '03') && <VideoSwapFeature project={project} onPlay={handleVideoPlay} onPause={handleVideoPause} />}
      {!isImageGallery && detail && <VideoFeature detail={detail} onPlay={handleVideoPlay} onPause={handleVideoPause} />}
    </div>

    {isImageGallery && <footer className="gallery-footer">
      {galleryDetail && <article className="gallery-project-intro">
        <span>{galleryDetail.eyebrow}</span>
        <p>{galleryDetail.description}</p>
      </article>}
      <div className="gallery-position" aria-live="polite"><span>{selected?.title}</span><small>{String(current + 1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</small></div>
      <div className="gallery-controls"><button aria-label="上一张图片" onClick={() => navigate('ArrowLeft')}>←</button><button aria-label="下一张图片" onClick={() => navigate('ArrowRight')}>→</button></div>
    </footer>}
    {!isImageGallery && <footer className="gallery-footer gallery-footer--video"><span>VIDEO WORK · FULL PREVIEW</span><small>点击画面播放 · 支持全屏观看</small></footer>}

    {zoomed && <div className="gallery-zoom" role="dialog" aria-modal="true" aria-label={`${zoomed.alt || zoomed.title} 大图`} onClick={() => setZoomed(null)}>
      <img src={zoomed.src} alt={zoomed.alt || zoomed.title || '作品大图'} decoding="async" onClick={event => event.stopPropagation()} />
      <button onClick={() => setZoomed(null)} aria-label="关闭大图">关闭 <span>×</span></button>
    </div>}
  </dialog>;
}
