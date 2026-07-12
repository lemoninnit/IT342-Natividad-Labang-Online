import { useRef, useEffect, useCallback } from 'react';
import './InfiniteCarousel.css';

/**
 * InfiniteCarousel
 * ─────────────────────────────────────────────────────────────────
 * Always-scrolling carousel — auto-scroll NEVER stops.
 * Drag/touch adds a manual offset on top of continuous auto-scroll.
 *
 * Props
 *   items  – array of { id, icon, label, title, subtitle, description }
 *   speed  – px per rAF frame  (default 0.8)
 * ─────────────────────────────────────────────────────────────────
 */
export default function InfiniteCarousel({ items = [], speed = 0.8 }) {
  const tripled = [...items, ...items, ...items];

  const trackRef        = useRef(null);
  const rafRef          = useRef(null);

  // Drag state — only used to compute additive drag offset
  const draggingRef     = useRef(false);
  const dragStartXRef   = useRef(0);
  const dragOffsetRef   = useRef(0); // accumulated drag delta this gesture

  // ── Scroll loop — ALWAYS runs, never pauses ──────────────────
  const tick = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const W = el.scrollWidth / 3;

    // Always advance by speed each frame
    el.scrollLeft += speed;

    // Seamless loop
    if (el.scrollLeft >= W * 2) {
      el.scrollLeft -= W;
    } else if (el.scrollLeft < W) {
      el.scrollLeft += W;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [speed]);

  // ── Init ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const init = () => { el.scrollLeft = el.scrollWidth / 3; };

    init();
    const t1 = setTimeout(init, 100);
    const t2 = setTimeout(init, 500);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [tick]);

  // ── Mouse drag ───────────────────────────────────────────────
  // We capture pointer on mousedown so mousemove/up fire even if
  // the cursor leaves the element during a fast drag.
  const handleMouseDown = (e) => {
    draggingRef.current   = true;
    dragStartXRef.current = e.pageX;
    dragOffsetRef.current = 0;
    trackRef.current.style.cursor = 'grabbing';
    trackRef.current.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;
    const newOffset = (dragStartXRef.current - e.pageX) * 1.5;
    const delta     = newOffset - dragOffsetRef.current; // only the new increment
    dragOffsetRef.current = newOffset;
    // apply additive offset — auto-scroll continues in the rAF loop
    if (trackRef.current) trackRef.current.scrollLeft += delta;
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    // End drag if pointer leaves without releasing button
    if (draggingRef.current) {
      draggingRef.current = false;
      if (trackRef.current) trackRef.current.style.cursor = 'grab';
    }
  };

  // ── Touch ────────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    draggingRef.current   = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragOffsetRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!draggingRef.current) return;
    const newOffset = (dragStartXRef.current - e.touches[0].clientX) * 1.5;
    const delta     = newOffset - dragOffsetRef.current;
    dragOffsetRef.current = newOffset;
    if (trackRef.current) trackRef.current.scrollLeft += delta;
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
  };

  return (
    <div className="ic-shell">
      {/* gradient edge masks */}
      <div className="ic-fade ic-fade-left"  aria-hidden="true" />
      <div className="ic-fade ic-fade-right" aria-hidden="true" />

      {/* scrollable track */}
      <div
        ref={trackRef}
        className="ic-track"
        style={{ cursor: 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {tripled.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="ic-card">
            {/* circular icon badge */}
            <div className="ic-card-icon-badge">
              {item.icon}
            </div>

            {/* label pill — top-right */}
            <div className="ic-card-label-pill">
              {item.label}
            </div>

            {/* body text */}
            <div className="ic-card-body">
              <div className="ic-card-title">{item.title}</div>
              <div className="ic-card-subtitle">{item.subtitle}</div>
              <p className="ic-card-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
