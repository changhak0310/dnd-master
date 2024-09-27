export const registDrag = ({
    onDragChange,
    onDragEnd,
    stopPropagation,
  }: {
    onDragChange: (deltaX: number, deltaY: number) => void;
    onDragEnd?: (deltaX: number, deltaY: number) => void;
    stopPropagation?: boolean;
  }) => {
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

        const mouseUpHandler = (upEvent: MouseEvent) => {
          currentElement.classList.remove("dragging");
          document.removeEventListener("mousemove", mouseMoveHandler);
          if (onDragEnd) {
            const deltaX = upEvent.screenX - clickEvent.screenX;
            const deltaY = upEvent.screenY - clickEvent.screenY;
            onDragEnd(deltaX, deltaY);
          }
        };

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler, { once: true });
      },
    };
  };