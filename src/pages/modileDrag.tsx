import { useEffect, useRef, useState } from "react";

interface Box1Props {
  boundaryRef: React.RefObject<HTMLDivElement>;
}

const Box1: React.FC<Box1Props> = ({ boundaryRef }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [{ x, y }, setPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const inrange = (v: number, min: number, max: number) => {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  };

  const handleMouseDown = (
    clickEvent: React.MouseEvent<Element, MouseEvent>
  ) => {
    const boundary = boundaryRef.current?.getBoundingClientRect();
    const box = boxRef.current?.getBoundingClientRect();

    if (boundary && box) {
      const currentElement = clickEvent.currentTarget;

      currentElement.classList.add("dragging");

      const mouseMoveHandler = (moveEvent: MouseEvent) => {
        const BOUNDARY_MARGIN = 12;
        const deltaX = moveEvent.screenX - clickEvent.screenX;
        const deltaY = moveEvent.screenY - clickEvent.screenY;

        setPosition({
          x: inrange(
            x + deltaX,
            Math.floor(-boundary.width / 2 + box.width / 2 + BOUNDARY_MARGIN),
            Math.floor(boundary.width / 2 - box.width / 2 - BOUNDARY_MARGIN)
          ),
          y: inrange(
            y + deltaY,
            Math.floor(-boundary.height / 2 + box.height / 2 + BOUNDARY_MARGIN),
            Math.floor(boundary.height / 2 - box.height / 2 - BOUNDARY_MARGIN)
          ),
        });
      };

      const mouseUpHandler = () => {
        currentElement.classList.remove("dragging");
        document.removeEventListener("mousemove", mouseMoveHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler, { once: true });
    }
  };

  const handleTouchStart = (touchEvent: React.TouchEvent<Element>) => {
    const boundary = boundaryRef.current?.getBoundingClientRect();
    const box = boxRef.current?.getBoundingClientRect();

    if (boundary && box) {
      const currentElement = touchEvent.currentTarget;
      const BOUNDARY_MARGIN = 12;

      currentElement.classList.add("dragging");

      const touchMoveHandler = (moveEvent: TouchEvent) => {
        if (moveEvent.cancelable) moveEvent.preventDefault();

        const deltaX = moveEvent.touches[0].pageX - touchEvent.touches[0].pageX;
        const deltaY = moveEvent.touches[0].pageY - touchEvent.touches[0].pageY;

        setPosition({
          x: inrange(
            x + deltaX,
            Math.floor(-boundary.width / 2 + box.width / 2 + BOUNDARY_MARGIN),
            Math.floor(boundary.width / 2 - box.width / 2 - BOUNDARY_MARGIN)
          ),
          y: inrange(
            y + deltaY,
            Math.floor(-boundary.height / 2 + box.height / 2 + BOUNDARY_MARGIN),
            Math.floor(boundary.height / 2 - box.height / 2 - BOUNDARY_MARGIN)
          ),
        });
      };

      const touchEndHandler = () => {
        currentElement.classList.remove("dragging");
        document.removeEventListener("touchmove", touchMoveHandler);
      };

      document.addEventListener("touchmove", touchMoveHandler, {
        passive: false,
      });
      document.addEventListener("touchend", touchEndHandler, { once: true });
    }
  };

  return (
    <div
      ref={boxRef}
      className="draggable"
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="w-12 h-12 bg-white rounded-lg" />
    </div>
  );
};

interface Box2Props {
  boundaryRef: React.RefObject<HTMLDivElement>;
  isTouch: boolean;
}

const Box2: React.FC<Box2Props> = ({ boundaryRef, isTouch }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [{ x, y }, setPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const inrange = (v: number, min: number, max: number) => {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  };

  if (isTouch) {
    const handleTouchStart = (touchEvent: React.TouchEvent<Element>) => {
      const boundary = boundaryRef.current?.getBoundingClientRect();
      const box = boxRef.current?.getBoundingClientRect();

      if (boundary && box) {
        const currentElement = touchEvent.currentTarget;
        const BOUNDARY_MARGIN = 12;

        currentElement.classList.add("dragging");

        const touchMoveHandler = (moveEvent: TouchEvent) => {
          if (moveEvent.cancelable) moveEvent.preventDefault();

          const deltaX =
            moveEvent.touches[0].pageX - touchEvent.touches[0].pageX;
          const deltaY =
            moveEvent.touches[0].pageY - touchEvent.touches[0].pageY;

          setPosition({
            x: inrange(
              x + deltaX,
              Math.floor(-boundary.width / 2 + box.width / 2 + BOUNDARY_MARGIN),
              Math.floor(boundary.width / 2 - box.width / 2 - BOUNDARY_MARGIN)
            ),
            y: inrange(
              y + deltaY,
              Math.floor(
                -boundary.height / 2 + box.height / 2 + BOUNDARY_MARGIN
              ),
              Math.floor(boundary.height / 2 - box.height / 2 - BOUNDARY_MARGIN)
            ),
          });
        };

        const touchEndHandler = () => {
          currentElement.classList.remove("dragging");
          document.removeEventListener("touchmove", touchMoveHandler);
        };

        document.addEventListener("touchmove", touchMoveHandler, {
          passive: false,
        });
        document.addEventListener("touchend", touchEndHandler, { once: true });
      }
    };
    return (
      <div
        ref={boxRef}
        className="draggable"
        style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
        onTouchStart={handleTouchStart}
      >
        <div className="w-12 h-12 bg-white rounded-lg" />
      </div>
    );
  } else {
    const handleMouseDown = (
      clickEvent: React.MouseEvent<Element, MouseEvent>
    ) => {
      const boundary = boundaryRef.current?.getBoundingClientRect();
      const box = boxRef.current?.getBoundingClientRect();

      if (boundary && box) {
        const currentElement = clickEvent.currentTarget;

        currentElement.classList.add("dragging");

        const mouseMoveHandler = (moveEvent: MouseEvent) => {
          const BOUNDARY_MARGIN = 12;
          const deltaX = moveEvent.screenX - clickEvent.screenX;
          const deltaY = moveEvent.screenY - clickEvent.screenY;

          setPosition({
            x: inrange(
              x + deltaX,
              Math.floor(-boundary.width / 2 + box.width / 2 + BOUNDARY_MARGIN),
              Math.floor(boundary.width / 2 - box.width / 2 - BOUNDARY_MARGIN)
            ),
            y: inrange(
              y + deltaY,
              Math.floor(
                -boundary.height / 2 + box.height / 2 + BOUNDARY_MARGIN
              ),
              Math.floor(boundary.height / 2 - box.height / 2 - BOUNDARY_MARGIN)
            ),
          });
        };

        const mouseUpHandler = () => {
          currentElement.classList.remove("dragging");
          document.removeEventListener("mousemove", mouseMoveHandler);
        };

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler, { once: true });
      }
    };
    return (
      <div
        ref={boxRef}
        className="draggable"
        style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
        onMouseDown={handleMouseDown}
      >
        <div className="w-12 h-12 bg-white rounded-lg" />
      </div>
    );
  }
};

function useTouchDetection() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkTouchDevice = () => {
        setIsTouchDevice(
          "ontouchstart" in window || navigator.maxTouchPoints > 0
        );
      };

      checkTouchDevice();

      window.addEventListener("resize", checkTouchDevice);
      return () => {
        window.removeEventListener("resize", checkTouchDevice);
      };
    }
  }, []);

  return isTouchDevice;
}

const Drag = () => {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const isTouch = useTouchDetection();

  return (
    <div className="flex justify-center items-center flex-col p-4 gap-3">
      <h1>Mobile Drag 적용</h1>
      <div
        ref={boundaryRef}
        className="w-full h-80 bg-stone-900 rounded-lg flex justify-center items-center"
      >
        <Box1 boundaryRef={boundaryRef} />
      </div>
      <h1>심화 - 터치가 {isTouch === true ? "" : "불"}가능합니다.</h1>
      <div
        ref={boundaryRef}
        className="w-full h-80 bg-stone-900 rounded-lg flex justify-center items-center"
      >
        <Box2 boundaryRef={boundaryRef} isTouch={isTouch} />
      </div>
    </div>
  );
};

export default Drag;
