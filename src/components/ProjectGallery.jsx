import React, { useEffect, useRef, useState } from 'react';
import FlexCarousel from './FlexCarousel';
import CardSwap, { Card } from './CardSwap';
import PortfolioVideoPlayer from './PortfolioVideoPlayer';
import galleries from '../gallery-data.json';
import './ProjectGallery.css';

const mediaSrc = path => `/hls/${path.replace(/\.mp4$/i, '')}/index.m3u8`;

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
    src: mediaSrc('skills-ui.mp4'),
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
    poster: '/images/video-posters/story/museum-night.jpg',
    eyebrow: 'AI NARRATIVE FILM / TV PROJECT',
    title: '博物馆奇妙夜',
    lead: '中秋之夜，一束月光照进非遗博物馆，今晚是个狂欢夜。',
    description: '青岛电视台中秋 AI 晚会节目片段，主要负责视频生成和素材制作；当前展示内容为重新剪辑版本。',
    role: 'AI 视频生成与素材制作',
    scope: ['非遗主题', '视频生成', '素材制作', '重新剪辑'],
  },
};

const DAYDREAM_ITEMS = [
  {
    src: mediaSrc('story/urban-daydream-01-v2.mp4'),
    poster: '/images/video-posters/story/urban-daydream-01.jpg',
    description: '当耳机中播放起 colt.45，我穿越到了西部世界。',
    achievement: '作品发布后获得 85.7 万播放、2.7 万点赞与 4344 次分享，获得平台 45 万流量激励，进入相关挑战榜 TOP 36。',
    stats: '857K VIEWS · 27K LIKES · 4.3K SHARES',
    evidence: [
      { src: '/images/evidence/urban-daydream-engagement.png', alt: '《都市白日梦》作品播放与互动数据证明' },
      { src: '/images/evidence/urban-daydream-top36.png', alt: '《都市白日梦》进入挑战榜 TOP 36 的平台证明' },
    ],
  },
  {
    src: mediaSrc('story/urban-daydream-02-v2.mp4'),
    poster: '/images/video-posters/story/urban-daydream-02.jpg',
    description: '量房走神的一瞬间，我的思绪穿越到了未来战场。',
  },
];

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

function DaydreamFeature({ onPlay, onPause, onZoom }) {
  const [activeItem, setActiveItem] = useState(0);
  const item = DAYDREAM_ITEMS[activeItem];

  function switchItem(direction) {
    setActiveItem(current => (current + direction + DAYDREAM_ITEMS.length) % DAYDREAM_ITEMS.length);
  }

  return <div className="daydream-feature">
    <div className="daydream-feature__visual">
      <div className="daydream-feature__media" key={`daydream-video-${activeItem}`}>
        <PortfolioVideoPlayer
          src={item.src}
          poster={item.poster}
          title="《都市白日梦》"
          preload="metadata"
          onPlay={onPlay}
          onPause={onPause}
        />
        <span className="daydream-feature__video-number">VIDEO / {String(activeItem + 1).padStart(2, '0')}</span>
      </div>
      <div className="daydream-feature__navigation">
        <div className="daydream-feature__arrows">
          <button type="button" onClick={() => switchItem(-1)} aria-label="切换至上一条《都市白日梦》视频">←</button>
          <button type="button" onClick={() => switchItem(1)} aria-label="切换至下一条《都市白日梦》视频">→</button>
        </div>
        <span aria-live="polite">{String(activeItem + 1).padStart(2, '0')} / {String(DAYDREAM_ITEMS.length).padStart(2, '0')}</span>
      </div>
    </div>

    <article className="video-feature__copy daydream-feature__copy" key={`daydream-copy-${activeItem}`}>
      <span className="video-feature__eyebrow">URBAN DAYDREAMS / AI NARRATIVE SHORTS</span>
      <h3>《都市白日梦》</h3>
      <p className="video-feature__lead">喧闹的都市里，身体仍在重复日常，思绪却在某个走神的瞬间脱离现实，漂向未知的时空。</p>
      <p className="video-feature__description">《都市白日梦》是一组由我独立完成的 AI 叙事短片。我从日常生活中的短暂失神出发，将音乐、空间与想象转化为不同的幻想世界，独立完成创意构思、脚本分镜、视觉设计、AI 素材生成及后期剪辑。</p>

      <div className="daydream-feature__current">
        <span>FILM {String(activeItem + 1).padStart(2, '0')}</span>
        <p>{item.description}</p>
      </div>

      {item.achievement && <section className="daydream-feature__achievement">
        <span>{item.stats}</span>
        <p>{item.achievement}</p>
        <div className="daydream-feature__evidence" aria-label="作品数据证明">
          {item.evidence.map((evidence, index) => <figure key={evidence.src}>
            <button type="button" onClick={() => onZoom(evidence)} aria-label={`查看大图：${evidence.alt}`}>
              <img src={evidence.src} alt={evidence.alt} loading="lazy" decoding="async" />
            </button>
            <figcaption>PLATFORM RECORD · {String(index + 1).padStart(2, '0')}</figcaption>
          </figure>)}
        </div>
      </section>}

      <div className="video-feature__meta"><span>ROLE</span><strong>个人独立创作</strong></div>
      <div className="video-feature__scope">
        {['创意构思', '脚本分镜', 'AI 视觉生成', '视频制作', '剪辑后期'].map(scope => <span key={scope}>{scope}</span>)}
      </div>
    </article>
  </div>;
}

export default function ProjectGallery({ project, onClose }) {
  const dialog = useRef(null);
  const stage = useRef(null);
  const zoomLayer = useRef(null);
  const zoomImage = useRef(null);
  const zoomDrag = useRef(null);
  const closeTimer = useRef(null);
  const fullscreenExitedAt = useRef(-Infinity);
  const [group, setGroup] = useState(initialGroup(project.id));
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const [zoomDragging, setZoomDragging] = useState(false);
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

  useEffect(() => {
    const rememberFullscreenExit = () => {
      if (!(document.fullscreenElement || document.webkitFullscreenElement)) fullscreenExitedAt.current = performance.now();
    };
    document.addEventListener('fullscreenchange', rememberFullscreenExit);
    document.addEventListener('webkitfullscreenchange', rememberFullscreenExit);
    return () => {
      document.removeEventListener('fullscreenchange', rememberFullscreenExit);
      document.removeEventListener('webkitfullscreenchange', rememberFullscreenExit);
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

  function openZoom(item) {
    setZoomScale(1);
    setZoomOffset({ x: 0, y: 0 });
    setZoomDragging(false);
    zoomDrag.current = null;
    setZoomed(item);
  }

  function closeZoom() {
    setZoomed(null);
    setZoomScale(1);
    setZoomOffset({ x: 0, y: 0 });
    setZoomDragging(false);
    zoomDrag.current = null;
  }

  function clampZoomOffset(offset, scale = zoomScale) {
    const layer = zoomLayer.current;
    const image = zoomImage.current;
    if (!layer || !image || scale <= 1) return { x: 0, y: 0 };
    const styles = getComputedStyle(layer);
    const availableWidth = Math.max(1, layer.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight));
    const availableHeight = Math.max(1, layer.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom));
    const maxX = Math.max(0, (image.offsetWidth * scale - availableWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * scale - availableHeight) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, offset.x)),
      y: Math.max(-maxY, Math.min(maxY, offset.y)),
    };
  }

  function handleZoomWheel(event) {
    event.preventDefault();
    event.stopPropagation();
    const image = zoomImage.current;
    if (!image) return;
    const nextScale = Math.max(1, Math.min(4, zoomScale - event.deltaY * .0015));
    if (nextScale === zoomScale) return;
    const imageBounds = image.getBoundingClientRect();
    const visualCenterX = imageBounds.left + imageBounds.width / 2;
    const visualCenterY = imageBounds.top + imageBounds.height / 2;
    const baseCenterX = visualCenterX - zoomOffset.x;
    const baseCenterY = visualCenterY - zoomOffset.y;
    const ratio = nextScale / zoomScale;
    const anchoredOffset = {
      x: event.clientX - baseCenterX - (event.clientX - baseCenterX - zoomOffset.x) * ratio,
      y: event.clientY - baseCenterY - (event.clientY - baseCenterY - zoomOffset.y) * ratio,
    };
    setZoomScale(nextScale);
    setZoomOffset(clampZoomOffset(anchoredOffset, nextScale));
  }

  function handleZoomPointerDown(event) {
    event.stopPropagation();
    if (zoomScale <= 1 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    zoomDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: zoomOffset.x,
      originY: zoomOffset.y,
    };
    setZoomDragging(true);
  }

  function handleZoomPointerMove(event) {
    const drag = zoomDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    setZoomOffset(clampZoomOffset({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    }));
  }

  function endZoomDrag(event) {
    const drag = zoomDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    zoomDrag.current = null;
    setZoomDragging(false);
  }

  useEffect(() => {
    if (!zoomed) return undefined;
    const keepInBounds = () => setZoomOffset(offset => clampZoomOffset(offset, zoomScale));
    window.addEventListener('resize', keepInBounds);
    return () => window.removeEventListener('resize', keepInBounds);
  }, [zoomed, zoomScale]);

  function handleDialogCancel(event) {
    event.preventDefault();
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else document.webkitExitFullscreen?.();
      return;
    }
    if (performance.now() - fullscreenExitedAt.current < 450) return;
    if (zoomed) closeZoom();
    else requestClose();
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
        ? [['stranger', '最熟悉的陌生人'], ['museum', '博物馆奇妙夜'], ['daydream', '都市白日梦']]
        : [];

  return <dialog ref={dialog} className="project-gallery" data-closing={closing ? '' : undefined} data-video-playing={videoPlaying ? '' : undefined} aria-label={`${project.title} 作品详情`} onCancel={handleDialogCancel}>
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
      {isImageGallery && <FlexCarousel key={group} items={items} preset="ribbon" intro="deal" fit="natural" cardHeight={0.70} gap={28} squeeze={0} bend={0.12} dispersion={0.08} focusOnClick={false} captions={false} onChange={index => setCurrent(index)} onSelect={(_, item) => openZoom(item)} />}
      {!isImageGallery && (project.id === '01' || project.id === '03') && <VideoSwapFeature project={project} onPlay={handleVideoPlay} onPause={handleVideoPause} />}
      {!isImageGallery && group === 'daydream' && project.id === '05' && <DaydreamFeature onPlay={handleVideoPlay} onPause={handleVideoPause} onZoom={openZoom} />}
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

    {zoomed && <div ref={zoomLayer} className="gallery-zoom" data-zoomed={zoomScale > 1 ? '' : undefined} data-dragging={zoomDragging ? '' : undefined} role="dialog" aria-modal="true" aria-label={`${zoomed.alt || zoomed.title} 大图`} onWheel={handleZoomWheel} onClick={closeZoom}>
      <img ref={zoomImage} src={zoomed.src} alt={zoomed.alt || zoomed.title || '作品大图'} decoding="async" draggable="false" style={{ transform: `translate3d(${zoomOffset.x}px, ${zoomOffset.y}px, 0) scale(${zoomScale})` }} onPointerDown={handleZoomPointerDown} onPointerMove={handleZoomPointerMove} onPointerUp={endZoomDrag} onPointerCancel={endZoomDrag} onClick={event => event.stopPropagation()} />
      <div className="gallery-zoom__status" aria-live="polite"><span>{zoomScale > 1 ? '拖动查看 · 滚轮缩放' : '滚轮缩放'}</span><strong>{Math.round(zoomScale * 100)}%</strong></div>
      <button onClick={closeZoom} aria-label="关闭大图">关闭 <span>×</span></button>
    </div>}
  </dialog>;
}
