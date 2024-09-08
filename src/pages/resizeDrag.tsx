import { useEffect, useRef, useState } from "react";

interface BoxProps {
  boundaryRef: React.RefObject<HTMLDivElement>;
}

const Box1: React.FC<BoxProps> = ({ boundaryRef }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [{ x, y, w, h }, setPosition] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const BOUNDARY_MARGIN = 12;
  const MIN_W = 48;
  const MIN_H = 48;

  useEffect(() => {
    const boundary = boundaryRef.current?.getBoundingClientRect();

    if (boundary) {
      const DEFAULT_W = 48;
      const DEFAULT_H = 48;
      setPosition({
        x: Math.floor(boundary.width / 2 - DEFAULT_W / 2),
        y: Math.floor(boundary.height / 2 - DEFAULT_H / 2),
        w: DEFAULT_W,
        h: DEFAULT_H,
      });
    }
  }, []);

  const inrange = (v: number, min: number, max: number) => {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  };

  // const handleMouseDown = (
  //   clickEvent: React.MouseEvent<Element, MouseEvent>,
  // ) => {
  //   clickEvent.preventDefault();
  // document.addEventListener("dragstart", (e) => e.preventDefault());
  //   const boundary = boundaryRef.current?.getBoundingClientRect();
  //   const box = boxRef.current?.getBoundingClientRect();

  //   if (boundary && box) {
  //     const currentElement = clickEvent.currentTarget;

  //     currentElement.classList.add("dragging");

  //     const mouseMoveHandler = (moveEvent: MouseEvent) => {
  //       const deltaX = moveEvent.screenX - clickEvent.screenX;
  //       const deltaY = moveEvent.screenY - clickEvent.screenY;

  //       setPosition({
  //         x: inrange(
  //           x + deltaX,
  //           Math.floor(-boundary.width / 2 + box.width / 2 + BOUNDARY_MARGIN),
  //           Math.floor(boundary.width / 2 - box.width / 2 - BOUNDARY_MARGIN)
  //         ),
  //         y: inrange(
  //           y + deltaY,
  //           Math.floor(-boundary.height / 2 + box.height / 2 + BOUNDARY_MARGIN),
  //           Math.floor(boundary.height / 2 - box.height / 2 - BOUNDARY_MARGIN)
  //         ),
  //         w: w,
  //         h: h
  //       });
  //     };

  //     const mouseUpHandler = () => {
  //       currentElement.classList.remove("dragging");
  //       document.removeEventListener("mousemove", mouseMoveHandler);
  //     };

  //     document.addEventListener("mousemove", mouseMoveHandler);
  //     document.addEventListener("mouseup", mouseUpHandler, { once: true });
  //   }

  // };

  //   const handleTouchStart = (
  //     touchEvent: React.TouchEvent<Element>
  //   ) => {
  //     const boundary = boundaryRef.current?.getBoundingClientRect();
  //     const box = boxRef.current?.getBoundingClientRect();

  //     if (boundary && box) {
  //       const currentElement = touchEvent.currentTarget;
  //       const BOUNDARY_MARGIN = 12;

  //       currentElement.classList.add("dragging");

  //       const touchMoveHandler = (moveEvent: TouchEvent) => {
  //         if (moveEvent.cancelable) moveEvent.preventDefault();

  //         const deltaX = moveEvent.touches[0].pageX - touchEvent.touches[0].pageX;
  //         const deltaY = moveEvent.touches[0].pageY - touchEvent.touches[0].pageY

  //         setPosition({
  //           x: inrange(
  //             x + deltaX,
  //             Math.floor(-boundary.width / 2 + box.width / 2 + BOUNDARY_MARGIN),
  //             Math.floor(boundary.width / 2 - box.width / 2 - BOUNDARY_MARGIN)
  //           ),
  //           y: inrange(
  //             y + deltaY,
  //             Math.floor(-boundary.height / 2 + box.height / 2 + BOUNDARY_MARGIN),
  //             Math.floor(boundary.height / 2 - box.height / 2 - BOUNDARY_MARGIN)
  //           ),
  //         });
  //       };

  //       const touchEndHandler = () => {
  //         currentElement.classList.remove("dragging");
  //         document.removeEventListener("touchmove", touchMoveHandler);
  //       };

  //       document.addEventListener("touchmove", touchMoveHandler, { passive: false });
  //       document.addEventListener("touchend", touchEndHandler, { once: true });

  //     }
  //   };

  const registDrag = (
    onDragChange: (deltaX: number, deltaY: number) => void,
    stopPropagation?: boolean
  ) => {
    return {
      onMouseDown: (clickEvent: React.MouseEvent<Element, MouseEvent>) => {
        clickEvent.preventDefault();
        document.addEventListener("dragstart", (e) => e.preventDefault());
        if (stopPropagation) clickEvent.stopPropagation();

        const currentElement = clickEvent.currentTarget;
        currentElement.classList.add("dragging");

        const mouseMoveHandler = (moveEvent: MouseEvent) => {
          const deltaX = moveEvent.screenX - clickEvent.screenX;
          const deltaY = moveEvent.screenY - clickEvent.screenY;
          onDragChange(deltaX, deltaY);
        };

        const mouseUpHandler = () => {
          currentElement.classList.remove("dragging");
          document.removeEventListener("mousemove", mouseMoveHandler);
        };

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler, { once: true });
      },
    };
  };

  return (
    <div
      ref={boxRef}
      className="draggable relative"
      style={{ width: w, height: h, left: x, top: y }}
      {...registDrag((deltaX, deltaY) => {
        if (!boundaryRef.current || !boxRef.current) return;

        const boundary = boundaryRef.current.getBoundingClientRect();
        const box = boxRef.current.getBoundingClientRect();

        setPosition({
          x: inrange(x + deltaX, BOUNDARY_MARGIN, boundary.width - w - BOUNDARY_MARGIN),
              y: inrange(y + deltaY, BOUNDARY_MARGIN, boundary.height - h - BOUNDARY_MARGIN),
          w: w,
          h: h,
        });
      })}
      //onMouseDown={handleMouseDown}
      //   onTouchStart={handleTouchStart}
    >
      <div className="w-full h-full bg-white rounded-lg box" />
      <div
        className="absolute bg-slate-300 -top-1 -left-1 h-4 w-4 cursor-nw-resize"
        {...registDrag((deltaX, deltaY) => {
          setPosition({
            x: inrange(x + deltaX, BOUNDARY_MARGIN, x + w - MIN_W),
            y: inrange(y + deltaY, BOUNDARY_MARGIN, y + h - MIN_H),
            w: inrange(w - deltaX, MIN_W, x + w - BOUNDARY_MARGIN),
            h: inrange(h - deltaY, MIN_H, y + h - BOUNDARY_MARGIN),
          });
        }, true)}
      />
      {/* 우상단 */}
      <div
        className="absolute bg-slate-300 -top-1 -right-1 h-4 w-4 cursor-ne-resize"
        {...registDrag((deltaX, deltaY) => {
          if (!boundaryRef.current) return;

          const boundary = boundaryRef.current.getBoundingClientRect();

          setPosition({
            x,
            y: inrange(y + deltaY, BOUNDARY_MARGIN, y + h - MIN_H),
            w: inrange(w + deltaX, MIN_W, boundary.width - x - BOUNDARY_MARGIN),
            h: inrange(h - deltaY, MIN_H, y + h - BOUNDARY_MARGIN),
          });
        }, true)}
      />
      {/* 좌하단 */}
      <div
        className="absolute bg-slate-300 -bottom-1 -left-1 h-4 w-4 cursor-ne-resize"
        {...registDrag((deltaX, deltaY) => {
          if (!boundaryRef.current) return;

          const boundary = boundaryRef.current.getBoundingClientRect();

          setPosition({
            x: inrange(x + deltaX, BOUNDARY_MARGIN, x + w - MIN_W),
            y,
            w: inrange(w - deltaX, MIN_W, x + w - BOUNDARY_MARGIN),
            h: inrange(
              h + deltaY,
              MIN_H,
              boundary.height - y - BOUNDARY_MARGIN
            ),
          });
        }, true)}
      />
      {/* 우하단 */}
      <div
        className="absolute bg-slate-300 -bottom-1 -right-1 h-4 w-4 cursor-se-resize"
        {...registDrag((deltaX, deltaY) => {
          if (!boundaryRef.current) return;

          const boundary = boundaryRef.current.getBoundingClientRect();

          setPosition({
            x,
            y,
            w: inrange(w + deltaX, MIN_W, boundary.width - x - BOUNDARY_MARGIN),
            h: inrange(
              h + deltaY,
              MIN_H,
              boundary.height - y - BOUNDARY_MARGIN
            ),
          });
        }, true)}
      />
      {/* 상단 */}
      <div
        className="absolute bg-slate-300 -top-0.5 left-3 right-3 h-2 cursor-n-resize"
        {...registDrag((_, deltaY) => {
          setPosition({
            x,
            y: inrange(y + deltaY, BOUNDARY_MARGIN, y + h - MIN_H),
            w,
            h: inrange(h - deltaY, MIN_H, y + h - BOUNDARY_MARGIN),
          });
        }, true)}
      />
      {/* 하단 */}
      <div
        className="absolute bg-slate-300 -bottom-0.5 left-3 right-3 h-2 cursor-s-resize"
        {...registDrag((_, deltaY) => {
          if (!boundaryRef.current) return;

          const boundary = boundaryRef.current.getBoundingClientRect();

          setPosition({
            x,
            y,
            w,
            h: inrange(
              h + deltaY,
              MIN_H,
              boundary.height - y - BOUNDARY_MARGIN
            ),
          });
        }, true)}
      />
      {/* 우측 */}
      <div
        className="absolute bg-slate-300 bottom-3 top-3 -right-0.5 w-2 cursor-e-resize"
        {...registDrag((deltaX) => {
          if (!boundaryRef.current) return;

          const boundary = boundaryRef.current.getBoundingClientRect();

          setPosition({
            x,
            y,
            w: inrange(w + deltaX, MIN_W, boundary.width - x - BOUNDARY_MARGIN),
            h,
          });
        }, true)}
      />
      {/* 좌측 */}
      <div
        className="absolute bg-slate-300 bottom-3 top-3 -left-0.5 w-2 cursor-w-resize"
        {...registDrag((deltaX) => {
          setPosition({
            x: inrange(x + deltaX, BOUNDARY_MARGIN, x + w - MIN_W),
            y,
            w: inrange(w - deltaX, MIN_W, x + w - BOUNDARY_MARGIN),
            h,
          });
        }, true)}
      />
    </div>
  );
};

const Drag = () => {
  const boundaryRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex justify-center items-center flex-col p-4 gap-3">
      <h1>Mobile Drag 적용</h1>
      <div
        ref={boundaryRef}
        className="w-full h-80 bg-stone-900 rounded-lg"
      >
        <Box1 boundaryRef={boundaryRef} />
      </div>
    </div>
  );
};

export default Drag;
