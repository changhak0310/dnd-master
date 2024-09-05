import { useRef, useState } from "react";

const Box = () => {
  const [{ x, y }, setPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (
    clickEvent: React.MouseEvent<Element, MouseEvent>
  ) => {
    const currentElement = clickEvent.currentTarget;
    currentElement.classList.add("dragging");

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.screenX - clickEvent.screenX;
      const deltaY = moveEvent.screenY - clickEvent.screenY;

      setPosition({
        x: x + deltaX,
        y: y + deltaY,
      });
    };

    const mouseUpHandler = () => {
      currentElement.classList.remove("dragging");
      document.removeEventListener("mousemove", mouseMoveHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler, {
      once: true,
    });
  };

  return (
    <div
      className="draggable"
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-12 h-12 bg-white rounded-lg" />
    </div>
  );
};

interface Box2Props {
  boundaryRef: React.RefObject<HTMLDivElement>;
}

const Box2: React.FC<Box2Props> = ({ boundaryRef }) => {
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
};

const Box3 = () => {
    const [{ x, y }, setPosition] = useState({
        x: 0,
        y: 0,
      });

      function registMouseDownDrag(
        onDragChange: (deltaX: number, deltaY: number) => void,
        stopPropagation?: boolean,
      ) {
        return {
          onMouseDown: (clickEvent: React.MouseEvent<Element, MouseEvent>) => {
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
              document.removeEventListener('mousemove', mouseMoveHandler);
            };
      
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler, { once: true });
          },
        };
      }

    return(
        <div
            className="draggable"
            style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
            {...registMouseDownDrag((deltaX, deltaY) => {
                setPosition({
                    x: x + deltaX,
                    y: y + deltaY,
                });
            })}
        > 
            <div className="w-12 h-12 bg-white rounded-lg"></div>
        </div>
    )
}

const Drag = () => {
  const boundaryRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex justify-center items-center flex-col p-4 gap-3">
      <h1>Drag 적용</h1>
      <div className="w-full h-80 bg-stone-900 rounded-lg flex justify-center items-center">
        <Box />
      </div>
      <h1>Drag Boundary 적용</h1>
      <div
        ref={boundaryRef}
        className="w-full h-80 bg-stone-900 rounded-lg flex justify-center items-center"
      >
        <Box2 boundaryRef={boundaryRef} />
      </div>
      <h1>응용 1</h1>
      <div
        className="w-full h-80 bg-stone-900 rounded-lg flex justify-center items-center"
      >
        <Box3 />
      </div>
    </div>
  );
};

export default Drag;
