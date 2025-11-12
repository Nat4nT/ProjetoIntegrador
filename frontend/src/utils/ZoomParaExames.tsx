import { useRef, useState } from "react";

type ZoomableImageProps = {
  src: string;
  alt?: string;
  maxScale?: number;
  minScale?: number;
};

export default function ZoomableImage({
  src,
  alt = "Exame",
  maxScale = 4,
  minScale = 1,
}: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState({
    active: false,
    startX: 0,
    startY: 0,
    startOX: 0,
    startOY: 0,
  });

  const clamp = (v: number, a: number, b: number) =>
    Math.max(a, Math.min(b, v));

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const delta = -e.deltaY; // para cima = zoom in
    const step = delta > 0 ? 0.1 : -0.1;
    const next = clamp(Number((scale + step).toFixed(2)), minScale, maxScale);
    setScale(next);
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (scale === 1) return; // sem pan quando não estiver zoomado
    setDrag({
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startOX: offset.x,
      startOY: offset.y,
    });
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!drag.active) return;
    setOffset({
      x: drag.startOX + (e.clientX - drag.startX),
      y: drag.startOY + (e.clientY - drag.startY),
    });
  };

  const onMouseUp = () => setDrag((d) => ({ ...d, active: false }));

  const zoomIn = () =>
    setScale((s) => clamp(Number((s + 0.2).toFixed(2)), minScale, maxScale));
  const zoomOut = () =>
    setScale((s) => clamp(Number((s - 0.2).toFixed(2)), minScale, maxScale));
  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const onDoubleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    // alterna 1x ↔ 2x
    if (scale === 1) setScale(2);
    else reset();
  };

  return (
    <div className="zoom-img-container">
      {/* Controles */}
      <div className="zoom-controls">
        <button onClick={zoomOut} aria-label="Diminuir zoom">
          −
        </button>
        <span className="zoom-level">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} aria-label="Aumentar zoom">
          +
        </button>
        <button onClick={reset} aria-label="Redefinir">
          Reset
        </button>
      </div>

      {/* Área de pan/zoom */}
      <div
        ref={containerRef}
        className="zoom-img-stage"
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="zoom-img"
          style={{
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      </div>
    </div>
  );
}
